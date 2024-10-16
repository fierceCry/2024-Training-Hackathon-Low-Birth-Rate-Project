const puppeteer = require("puppeteer");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const url = "https://www.childcare.go.kr/?menuno=279"; // 크롤링할 URL

    try {
      const { prisma } = await import('../src/database/db.prisma.js'); // 동적 import

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      // 브라우저의 콘솔 로그를 Node.js 콘솔로 출력
      page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

      await page.goto(url, { waitUntil: "networkidle2" });

      let currentPage = 1;
      const allItems = [];
      let hasMorePages = true;

      while (hasMorePages) {
        console.log(`Scraping page ${currentPage}`);

        // 현재 페이지 데이터 크롤링
        const items = await page.evaluate(() => {
          const rows = Array.from(
            document.querySelectorAll(".table_type01.hnone.scroll.text_center.mb30 tbody tr"),
          );
          return rows
            .map((row) => {
              const numberElement = row.querySelector("td:nth-child(1)");
              const titleElement = row.querySelector("td.tal a");
              const viewCountElement = row.querySelector("td:nth-child(3)");
              const registrationDateElement = row.querySelector("td:nth-child(4)");
              const onclick = titleElement ? titleElement.getAttribute("onclick") : null;

              const number = numberElement ? numberElement.innerText.trim() : null;
              const title = titleElement ? titleElement.innerText.trim() : null;
              const viewCount = viewCountElement ? viewCountElement.innerText.trim() : null;
              const registrationDate = registrationDateElement
                ? registrationDateElement.innerText.trim()
                : null;
              return { number, title, viewCount, registrationDate, onclick };
            })
            .filter((item) => item.number && item.title);
        });

        console.log(items);
        allItems.push(...items);

        // 각 아이템의 상세 정보를 크롤링
        for (let item of items) {
          try {
            // item.number가 1인 경우 크롤링 후 종료
            if (item.number === "1") {
              console.log("item.number가 1이므로 크롤링을 종료합니다.");
              hasMorePages = false; // 더 이상 페이지를 크롤링하지 않음
            }

            if (item.onclick) {
              await page.evaluate((onclick) => {
                const fn = new Function(onclick);
                fn();
              }, item.onclick);
              console.log(`Navigated to detail page for ${item.number} ${item.title}`);
              await page.waitForNavigation({ waitUntil: "networkidle2" });

              const detailData = await page.evaluate(() => {
                let title =
                  document.querySelector(".sub_contents_wrap .contents .text-bbsbox .bbstitle")
                    ?.innerText || "No Title";
                let content =
                  document.querySelector(".sub_contents_wrap .contents .text-bbsbox .textview")
                    ?.innerText || "No Content";
                
                // 제목을 공백으로 분할
                const titleParts = title.split(" ");
                
                // addressProvince와 addressCity에 각각 값 할당
                const addressProvince = titleParts[0]; // 첫 번째 부분
                const addressCity = titleParts[1];      // 두 번째 부분

                // title에서 두 부분을 제거한 나머지를 다시 합침
                title = titleParts.slice(2).join(" ").trim(); // 필요한 경우에 따라 title 수정

                content = content.replace(/\n/g, "<br>").replace(/\s\s+/g, " ").trim();
              
                return { addressProvince, addressCity, title, content };
              });

              item.detailTitle = detailData.title;
              item.detailContent = detailData.content;
              item.addressProvince = detailData.addressProvince; // addressProvince 추가
              item.addressCity = detailData.addressCity; // addressCity 추가
            }

            // 데이터베이스에 저장
            await prisma.birthSupportData.create({
              data: {
                number: item.number,
                title: item.title,
                registrationDate: item.registrationDate,
                addressProvince: item.addressProvince, // addressProvince 저장
                addressCity: item.addressCity, // addressCity 저장
                detailContent: item.detailContent,
              },
            });

            // 이전 페이지로 돌아오기
            await page.goBack({ waitUntil: "networkidle2" });

            // 오류 페이지 확인
            const errorPage = await page.evaluate(() => {
              const errorElement = document.getElementById("main-frame-error");
              return errorElement ? true : false;
            });

            if (errorPage) {
              console.log(`Error page encountered when going back from ${item.title}. Skipping...`);
              await page.goBack({ waitUntil: "networkidle2" });
              continue;
            }
          } catch (error) {
            console.log(`Error processing item ${item.number}, ${item.title}:`, error);
            continue;
          }
        }

        // 다음 페이지로 이동하는 로직
        const nextPageExists = await page.evaluate((currentPage) => {
          const nextLinks = Array.from(document.querySelectorAll(".paging.mb30 a"));
          const result = [];

          nextLinks.forEach((link) => {
            const onclick = link.getAttribute("onclick");
            const pageNumber = parseInt(link.innerText);

            // 첫 페이지와 이전 페이지는 건너뜀
            if (onclick && onclick.includes("jsListReq") && pageNumber > currentPage) {
              result.push({
                text: link.innerText,
                onclick: onclick,
              });
            }
          });

          return {
            exists: result.length > 0,
            onclick: result.length > 0 ? result[0].onclick : null,
          };
        }, currentPage);

        console.log("Next Links:", nextPageExists);

        if (nextPageExists.exists && nextPageExists.onclick) {
          // 다음 페이지로 이동
          await page.evaluate((onclick) => {
            const fn = new Function(onclick);
            fn();
          }, nextPageExists.onclick);

          // 페이지 로드 완료까지 대기
          await page.waitForNavigation({ waitUntil: "networkidle2" });
          currentPage++;
        } else {
          console.log("다음 페이지가 없습니다.");
          hasMorePages = false; // 더 이상 페이지가 없으면 루프 종료
        }
      }

      console.log("All Items:", allItems);
      await browser.close();
    } catch (error) {
      console.error("Error during web scraping:", error);
    } finally {
      await prisma.$disconnect(); // Prisma 연결 종료
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("BirthSupportData", null, {});
  },
};

const puppeteer = require("puppeteer");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const url = "https://www.childcare.go.kr/?menuno=279"; // 크롤링할 URL

    try {
      const { prisma } = await import('../src/database/db.prisma.js');

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

        allItems.push(...items);

        // 각 아이템의 상세 정보를 크롤링
        for (let item of items) {
          try {
            if (item.number === "1") {
              console.log("item.number가 1이므로 크롤링을 종료합니다.");
              hasMorePages = false;
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
                

                const titleParts = title.split(" ");
                
                const addressProvince = titleParts[0];
                const addressCity = titleParts[1];

                title = titleParts.slice(2).join(" ").trim();

                content = content.replace(/\n/g, "<br>").replace(/\s\s+/g, " ").trim();
              
                return { addressProvince, addressCity, title, content };
              });

              item.detailTitle = detailData.title;
              item.detailContent = detailData.content;
              item.addressProvince = detailData.addressProvince;
              item.addressCity = detailData.addressCity;
            }

            // 데이터베이스에 저장
            await prisma.birthSupportData.create({
              data: {
                number: item.number,
                title: item.title,
                registrationDate: item.registrationDate,
                addressProvince: item.addressProvince,
                addressCity: item.addressCity,
                detailContent: item.detailContent,
              },
            });

            await page.goBack({ waitUntil: "networkidle2" });

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
          hasMorePages = false;
        }
      }

      console.log("All Items:", allItems);
      await browser.close();
    } catch (error) {
      console.error("Error during web scraping:", error);
    } finally {
      await prisma.$disconnect();
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("BirthSupportData", null, {});
  },
};

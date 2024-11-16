const puppeteer = require("puppeteer");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async () => {
    const url = "https://www.childcare.go.kr/?menuno=279";

    try {
      const { prisma } = await import("../src/database/db.prisma.js");

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

      await page.goto(url, { waitUntil: "networkidle2" });

      let currentPage = 1;
      const allItems = [];
      let hasMorePages = true;

      while (hasMorePages) {
        const items = await page.evaluate(() => {
          const rows = Array.from(
            document.querySelectorAll(".board.boardlist.responsive.t_center tbody tr"),
          );
          return rows
            .map((row) => {
              const numberElement = row.querySelector("td.divide");
              const titleElement = row.querySelector("td.t_left.divide.t_con a");
              const viewCountElement = row.querySelector("td:nth-child(3) .tx_blue");
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
                  document.querySelector(".board_detail .title-box h3")?.innerText || "No Title";
                let content =
                  document.querySelector(".board_detail .content")?.innerText || "No Content";

                const titleParts = title.split(" ");
                const addressProvince = titleParts[0];
                const addressCity = titleParts[1];
                title = titleParts.slice(2).join(" ").trim();
                content = content.replace(/\n/g, "").replace(/\s\s+/g, " ").trim();

                const sections = content.match(/\[.*?\].*?(?=\[|$)/g);
                const details = sections
                  .map((section) => {
                    const sectionTitle = section.match(/\[(.*?)\]/)[1];
                    const sectionDetails = section.replace(/\[.*?\]/, "").trim();
                    return { sectionTitle, sectionDetails };
                  })
                  .filter((section) => !section.sectionTitle.includes("등록일"));

                return { addressProvince, addressCity, title, details };
              });

              item.detailTitle = detailData.title;
              item.detailContent = detailData.details;
              item.addressProvince = detailData.addressProvince;
              item.addressCity = detailData.addressCity;

              for (let detail of detailData.details) {
                const splitDetails = detail.sectionDetails.split(/(?=\d+\.\s)/);

                let supportTarget = ""; // 지원대상
                let supportContent = ""; // 지원내용
                let inquiryContact = ""; // 문의처
                let inquiryDetail = ""; // 문의
                let applicationMethod = ""; // 신청자격
                let requiredDocuments = ""; // 구비서류
                let source = ""; // 출처
                let eligibility = ""; // 지원자격
                let supportAmount = ""; // 지원금액
                let applicationPeriod = ""; // 신청기간
                let applicationMethodDetail = ""; // 신청방법
                let supportItems = ""; // 지원품목

                for (let item of splitDetails) {
                  const match = item.match(/^(\d+)\.\s*(.*)/);
                
                  if (match) {
                    const content = match[2].trim();
                
                    // 지원대상
                    if (content.startsWith("지원대상")) {
                      supportTarget = content.replace(/^지원대상\s*:\s*/, "").trim();
                    }
                    // 지원내용
                    else if (content.startsWith("지원내용")) {
                      supportContent = content.replace(/^지원내용\s*:\s*/, "").trim();
                    }
                    // 지원금액
                    else if (content.startsWith("지원금액")) {
                      supportAmount = content.replace(/^지원금액\s*:\s*/, "").trim();
                    }
                    // 신청기간
                    else if (content.startsWith("신청기간")) {
                      applicationPeriod = content.replace(/^신청기간\s*:\s*/, "").trim();
                    }
                    // 신청방법
                    else if (content.startsWith("신청방법")) {
                      applicationMethodDetail = content.replace(/^신청방법\s*:\s*/, "").trim();
                    }
                    // 문의처
                    else if (content.startsWith("문의처")) {
                      inquiryContact = content.replace(/^문의처\s*:\s*/, "").trim();
                    }
                    // 문의
                    else if (content.startsWith("문의")) {
                      inquiryDetail = content.replace(/^문의\s*:\s*/, "").trim();
                    }
                    // 지원자격
                    else if (content.startsWith("지원자격")) {
                      eligibility = content.replace(/^지원자격\s*:\s*/, "").trim();
                    }
                    // 지원품목
                    else if (content.startsWith("지원품목")) {
                      supportItems = content.replace(/^지원품목\s*:\s*/, "").trim();
                    }
                    // 구비서류
                    else if (content.startsWith("구비서류")) {
                      requiredDocuments = content.replace(/^구비서류\s*:\s*/, "").trim();
                    }
                    // 출처
                    else if (content.startsWith("출처")) {
                      source = content.replace(/^출처\s*:\s*/, "").trim();
                    }
                  }
                }
                
                const data = await prisma.birthSupportData.create({
                  data: {
                    number: item.number,
                    title: `${item.title}(${detail.sectionTitle})`,
                    registrationDate: item.registrationDate,
                    addressProvince: item.addressProvince,
                    addressCity: item.addressCity,
                    supportTarget: supportTarget,
                    supportContent: supportContent,
                    inquiryContact: inquiryContact,
                    inquiryDetail: inquiryDetail,
                    applicationMethod: applicationMethod,
                    requiredDocuments: requiredDocuments,
                    source: source,
                    eligibility: eligibility,
                    supportAmount: supportAmount,
                    applicationPeriod: applicationPeriod,
                    applicationMethodDetail: applicationMethodDetail,
                    supportItems: supportItems,
                  },
                });
              }
            }

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

        const nextPageExists = await page.evaluate((currentPage) => {
          const nextLinks = Array.from(document.querySelectorAll(".paging.mb30 a"));
          const result = [];

          nextLinks.forEach((link) => {
            const onclick = link.getAttribute("onclick");
            const pageNumber = parseInt(link.innerText);

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
          await page.evaluate((onclick) => {
            const fn = new Function(onclick);
            fn();
          }, nextPageExists.onclick);

          await page.waitForNavigation({ waitUntil: "networkidle2" });
          currentPage++;
        } else {
          console.log("jsListReq가 발견되지 않았습니다. 직접 페이지 번호를 증가시킵니다.");

          currentPage++;
          const nextPageClick = `jsListReq(${currentPage})`;
          await page.evaluate((click) => {
            const fn = new Function(click);
            fn();
          }, nextPageClick);

          await page.waitForNavigation({ waitUntil: "networkidle2" });

          const noMorePages = await page.evaluate(() => {
            const noDataMessage = document.querySelector(".no_data");
            return noDataMessage ? true : false;
          });

          if (noMorePages) {
            console.log("더 이상 페이지가 없습니다.");
            hasMorePages = false;
          }
        }
      }

      console.log("All Items:", allItems);
      await browser.close();
    } catch (error) {
      console.log("크롤링 중 오류가 발생했습니다:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("BirthSupportData", null, {});
  },
};

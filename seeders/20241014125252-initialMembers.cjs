const puppeteer = require("puppeteer");
const { default: getLogger } = require("../src/common/logger.js");

const logger = getLogger('지원금리스트')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
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
              logger.info("item.number가 1이므로 크롤링을 종료합니다.");
              hasMorePages = false;
            }

            if (item.onclick) {
              await page.evaluate((onclick) => {
                const fn = new Function(onclick);
                fn();
              }, item.onclick);
              logger.info(`Navigated to detail page for ${item.number} ${item.title}`);
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

              logger.info("detailData:", detailData);
              item.detailTitle = detailData.title;
              item.detailContent = detailData.details;
              item.addressProvince = detailData.addressProvince;
              item.addressCity = detailData.addressCity;

              for (let detail of detailData.details) {
                const splitDetails = detail.sectionDetails.split(/(?=\d+\.\s)/);

                let supportTarget = "";
                let supportContent = "";
                let inquiry = "";
                let applicationMethod = "";
                let requiredDocuments = "";
                let source = "";
                let eligibility = "";
                let supportAmount = "";

                for (let item of splitDetails) {
                  const match = item.match(/^(\d+)\.\s*(.*)/);

                  if (match) {
                    const content = match[2].trim();

                    if (content.includes("지원대상")) {
                      supportTarget = content.replace("지원대상:", "").replace("-", "").trim();
                    } else if (content.includes("준비사항")) {
                      supportTarget = content.replace("준비사항:", "").replace("-", "").trim();
                    } else if (content.includes("지원내용")) {
                      supportContent = content.replace("지원내용:", "").replace("-", "").trim();
                    } else if (content.includes("지원대상")) {
                      supportContent = content.replace("지원대상:", "").replace("-", "").trim();
                    } else if (content.includes("문의")) {
                      inquiry = content.replace("문의:", "").replace("-", "").trim();
                    } else if (content.includes("문의사항")) {
                      inquiry = content.replace("문의사항:", "").replace("-", "").trim();
                    } else if (content.includes("신청방법")) {
                      applicationMethod = content.replace("신청방법:", "").replace("-", "").trim();
                    } else if (content.includes("구비서류")) {
                      requiredDocuments = content.replace("구비서류:", "").replace("-", "").trim();
                    } else if (content.includes("출처")) {
                      source = content.replace("출처:", "").replace("-", "").trim();
                    } else if (content.includes("자격")) {
                      eligibility = content.replace("자격:", "").replace("-", "").trim();
                    } else if (content.includes("지원금액")) {
                      supportAmount = content.replace("지원금액:", "").replace("-", "").trim();
                    }
                  }
                }

                // 중복 데이터 확인 후 저장
                const existingData = await prisma.birthSupportData.findUnique({
                  where: { number: item.number },
                });

                if (!existingData) {
                  await prisma.birthSupportData.create({
                    data: {
                      number: item.number,
                      title: `${item.title}(${detail.sectionTitle})`,
                      registrationDate: item.registrationDate,
                      addressProvince: item.addressProvince,
                      addressCity: item.addressCity,
                      supportTarget: supportTarget,
                      supportContent: supportContent,
                      inquiry: inquiry,
                      applicationMethod: applicationMethod,
                      requiredDocuments: requiredDocuments,
                      source: source,
                      eligibility: eligibility,
                      supportAmount: supportAmount,
                    },
                  });
                } else {
                  logger.info(`Item ${item.number} already exists in the database. Skipping.`);
                }
              }
            }

            await page.goBack({ waitUntil: "networkidle2" });

            const errorPage = await page.evaluate(() => {
              const errorElement = document.getElementById("main-frame-error");
              return errorElement ? true : false;
            });

            if (errorPage) {
              logger.info(`Error page encountered when going back from ${item.title}. Skipping...`);
              await page.goBack({ waitUntil: "networkidle2" });
              continue;
            }
          } catch (error) {
            logger.info(`Error processing item ${item.number}, ${item.title}:`, error);
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

        logger.info("Next Links:", nextPageExists);

        if (nextPageExists.exists && nextPageExists.onclick) {
          await page.evaluate((onclick) => {
            const fn = new Function(onclick);
            fn();
          }, nextPageExists.onclick);

          await page.waitForNavigation({ waitUntil: "networkidle2" });
          currentPage++;
        } else {
          logger.info("jsListReq가 발견되지 않았습니다. 직접 페이지 번호를 증가시킵니다.");

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
            logger.info("더 이상 페이지가 없습니다.");
            hasMorePages = false;
          }
        }
      }

      logger.info("All Items:", allItems);
      await browser.close();
    } catch (error) {
      logger.info("크롤링 중 오류가 발생했습니다:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("BirthSupportData", null, {});
  },
};

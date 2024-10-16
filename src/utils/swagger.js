import swaggerJSDoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "해커톤 프로젝트",
      version: "1.0.0",
      description: "저출산 해커톤 프로젝트",
    },
  },
  apis: ["./src/routers/*.js"], 
};

export const swaggerSpec = swaggerJSDoc(options);

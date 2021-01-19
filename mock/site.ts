import { respond } from "./utils";

export default {
  "GET /api/site/all": (req: any, res: any) => {
    res.writeHead(200, {
      "Content-Type": "application/json",
      charset: "utf-8"
    });

    const { authorization } = req.headers;

    if (!authorization) {
      res.end(JSON.stringify(respond({}, 401)));
    }
    res.end(
      JSON.stringify(
        respond({
          list: [
            {
              id: 1,
              name: "中文站"
            },
            {
              id: 2,
              name: "英文站"
            }
          ]
        })
      )
    );
  }
};

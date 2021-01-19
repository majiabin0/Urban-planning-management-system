import { rsaDecrypt, aesDecrypt, respond } from "./utils";

export default {
  "GET /api/articleType/all": (req: any, res: any) => {
    res.writeHead(200, {
      "Content-Type": "application/json",
      charset: "utf-8"
    });

    const { authorization } = req.headers;

    if (!authorization) {
      res.end(JSON.stringify(respond({}, 401)));
    }

    const key = rsaDecrypt(req.headers["x-aes-key"]);

    const siteId = aesDecrypt(req.query.siteId, key);

    let list: any[] = [];

    if (Number(siteId) == 1) {
      // 中文站模拟栏目
      list = [
        {
          id: 1,
          parentId: null,
          name: "解决方案"
        },
        {
          id: 2,
          parentId: null,
          name: "科技创新"
        },
        {
          id: 3,
          parentId: null,
          name: "关于我们"
        },
        {
          id: 4,
          parentId: null,
          name: "新闻中心"
        },
        {
          id: 5,
          parentId: null,
          name: "党群工作"
        },
        {
          id: 6,
          parentId: null,
          name: "人力资源"
        },
        {
          id: 13,
          parentId: 1,
          name: "业务与案例"
        },
        {
          id: 14,
          parentId: 1,
          name: "专家团队"
        },
        {
          id: 15,
          parentId: 1,
          name: "合作伙伴"
        },
        {
          id: 16,
          parentId: 1,
          name: "科研成果"
        }
      ];
    } else if (Number(siteId) == 2) {
      // 英文站模拟栏目
      list = [
        {
          id: 7,
          parentId: null,
          name: "Solution"
        },
        {
          id: 8,
          parentId: null,
          name: "Technological innovation"
        },
        {
          id: 9,
          parentId: null,
          name: "About us"
        },
        {
          id: 10,
          parentId: null,
          name: "News"
        },
        {
          id: 11,
          parentId: null,
          name: "Party work"
        },
        {
          id: 12,
          parentId: null,
          name: "HR"
        }
      ];
    }

    res.end(JSON.stringify(respond({ list })));
  },

  "POST /api/articleType/delete": (req: any, res: any) => {
    res.writeHead(200, {
      "Content-Type": "application/json",
      charset: "utf-8"
    });

    const { authorization } = req.headers;

    if (!authorization) {
      res.end(JSON.stringify(respond({}, 401)));
    }

    res.end(JSON.stringify(respond({})));
  },

  "POST /api/articleType/update": (req: any, res: any) => {
    res.writeHead(200, {
      "Content-Type": "application/json",
      charset: "utf-8"
    });

    const { authorization } = req.headers;

    if (!authorization) {
      res.end(JSON.stringify(respond({}, 401)));
    }

    res.end(JSON.stringify(respond({})));
  },

  "POST /api/articleType/add": (req: any, res: any) => {
    res.writeHead(200, {
      "Content-Type": "application/json",
      charset: "utf-8"
    });

    const { authorization } = req.headers;

    if (!authorization) {
      res.end(JSON.stringify(respond({}, 401)));
    }

    res.end(JSON.stringify(respond({})));
  }
};

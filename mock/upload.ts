import { respond } from "./utils";

export default {
  "POST /api/upload": (req: any, res: any) => {
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
          url: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
        })
      )
    );
  }
};

import path from "path";

export default (api: any) => {
  return api.chainWebpack((config: any) => {
    config.entry("mooween").add(path.join(api.paths.absTmpPath!, "umi.ts"));
    config.entryPoints.delete("umi");
  });
};

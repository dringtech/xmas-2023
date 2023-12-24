import lume from "lume/mod.ts";
import base_path from "lume/plugins/base_path.ts";
import esbuild from "lume/plugins/esbuild.ts";
import minify_html from "lume/plugins/minify_html.ts";

const site = lume();

site.use(base_path());
// site.use(esbuild({
//     options: {
//         entryPoints: [
//             "xmas_2023.js",
//         ]
//     }
// }));
// site.use(minify_html());

site.copy(['.js']);
site.copy('static');

export default site;

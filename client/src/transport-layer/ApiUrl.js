//发布后的相对根目录
const ROOT = `${process.env.PUBLIC_URL}/api`;
const urls = {	
  LOGIN: "/login", // 密码登录   示例代码，可以删除
  REGISTER: "/login", // 用户注册  示例代码，可以删除
  UPLOADIMG: "/postImg", // 提交构建数据
  ADHOOK: "/main/actives/list",
  DONE: "/getjson" // 提交构建数据
};
for (var key in urls) {
  let v = urls[key];
  if (v.indexOf("/") > 0) v = `/${v}`;
  urls[key] = `${ROOT}${v}`;
}
urls.BASE = ROOT;
export default urls;

const express = require("express");
const path = require("path");
const app = express();
/**
 * ����ʽ�������������������
 */
const proxy = require("http-proxy-middleware");

//context�����ǵ����ַ�����Ҳ�����Ƕ���ַ�������
const context = ["/api"];
//����Ҫ�����Ľӿڵ�ַ��������ip������
const options = {
  target: "http://127.0.0.1:8080",
  changeOrigin: true
};
//��options������proxy��װ��������Ϊ��������
const apiProxy = proxy(options);
app.use(context, apiProxy);

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3000);

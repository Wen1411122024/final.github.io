

const express = require("express");
const bodyParser = require("body-parser");
const DB = require("nedb-promises");

const app = express();
const port = 3000;

// 靜態檔案
app.use(express.static(__dirname + "/public"));

// 設定解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 建立資料庫
const portfolioDB = DB.create(__dirname + "/portfolio.db");

// API 路由：取得所有作品
app.get("/api/portfolio", async (req, res) => {
    try {
        const items = await portfolioDB.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "無法取得資料" });
    }
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

portfolioDB.insert([
    { title: "作品1", imgSrc: "/pic/2024spooky month.png", description: "這是我的第一個作品" },
    { title: "作品2", imgSrc: "/pic/cwtt32.png", description: "這是我的第二個作品" },
    { title: "作品3", imgSrc: "/pic/OC復健.png", description: "這是我的第三個作品" }
]);

// API 路由：上傳新作品
app.post("/api/portfolio", async (req, res) => {
    try {
        const newItem = req.body;
        await portfolioDB.insert(newItem);
        res.status(201).json({ message: "作品已成功新增！" });
    } catch (error) {
        res.status(500).json({ error: "無法新增作品" });
    }
});

const cors = require("cors");

// 啟用 CORS
server.use(cors());


// 引入必要模組
var express = require("express"); // 引入 Express
var cors = require("cors");
var bodyParser = require("body-parser");

// 建立伺服器實例
var server = express();

// 使用中介軟體
server.use(cors());// 啟用 CORS
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// 靜態檔案目錄
server.use(express.static(__dirname + "/public"));

// 路由設定
server.get("/api/portfolio", (req, res) => {
  res.send("這是作品集 API");
});

// 啟動伺服器
server.listen(3000, () => {
  console.log("伺服器正在 http://localhost:3000 運行");
});

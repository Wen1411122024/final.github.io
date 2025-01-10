// 引入必要模組
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const DB = require("nedb-promises");

// 建立伺服器實例
const app = express();
const port = 3000;

// 啟用 CORS
app.use(cors());

// 設定靜態檔案目錄
app.use(express.static(__dirname + "/public"));

// 設定解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 建立資料庫
const portfolioDB = DB.create(__dirname + "/portfolio.db");

// 🚀 初始化資料庫（僅執行一次）
portfolioDB.insert([
    { title: "作品1", imgSrc: "/pic/2024spooky month.png", description: "這是我的第一個作品" },
    { title: "作品2", imgSrc: "/pic/cwtt32.png", description: "這是我的第二個作品" },
    { title: "作品3", imgSrc: "/pic/OC復健.png", description: "這是我的第三個作品" }
]).then(() => {
    console.log("資料庫初始化完成！");
}).catch(err => {
    console.error("資料庫初始化失敗：", err);
});

// 📝 API 路由：取得所有作品
app.get("/api/portfolio", async (req, res) => {
    try {
        const items = await portfolioDB.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "無法取得資料" });
    }
});

// ➕ API 路由：上傳新作品
app.post("/api/portfolio", async (req, res) => {
    try {
        const newItem = req.body;
        await portfolioDB.insert(newItem);
        res.status(201).json({ message: "作品已成功新增！" });
    } catch (error) {
        res.status(500).json({ error: "無法新增作品" });
    }
});

// 🗑️ API 路由：刪除作品
app.delete("/api/portfolio/:id", async (req, res) => {
    try {
        await portfolioDB.remove({ _id: req.params.id });
        res.json({ message: "作品已成功刪除！" });
    } catch (error) {
        res.status(500).json({ error: "無法刪除作品" });
    }
});

// 🚀 啟動伺服器
app.listen(port, () => {
    console.log(`伺服器正在 http://localhost:${port} 運行`);
});

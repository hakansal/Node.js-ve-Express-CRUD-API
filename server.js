const express = require("express");
const bodyParser = require('body-parser');
const connecttodb = require("./config");

//  .env  değerleri yükleme
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

// express app yaratma
const app = express();

// Middleware  
app.use(express.json());

// Connect to the database
connecttodb.connect();

//  veri çekme
app.get("/veriler", (req, res) => {
    connecttodb.query("SELECT * FROM kart", (err, rows, fields) => {
        if (err)  
            console.error("hata");
            
            
         
         
        res.json(rows);
        connecttodb.close();
    });
});

// veri ekleme
app.put("/ekle", (req, res) => {
    const { stok_kodu, stok_adi, stok_tipi, birimi, barkodu, kdv_tipi, aciklama, olusturma_zamani } = req.body;
    const query = "INSERT INTO kart (stok_kodu, stok_adi, stok_tipi, birimi, barkodu, kdv_tipi, aciklama, olusturma_zamani) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [stok_kodu, stok_adi, stok_tipi, birimi, barkodu, kdv_tipi, aciklama, olusturma_zamani];
    
    connecttodb.query(query, values, (err, result) => {
        if (err)  console.log("veri eklenemedi");
             
        
       console.log("veri eklendi")
    });
});
//veri silme stok koduna göre
app.delete("/sil/:id",(req,res)=>{
    const _id=req.params.id;

    const query="DELETE FROM kart WHERE stok_kodu=?";
    connecttodb.query(query,[_id],(err,result)=>{
      if(err)console.log("silinemedi");
      console.log("silindi");
      connecttodb.close();
    });
     
});
//veri güncelleme
app.put("/update/:id",(req,res)=>{
   const _id=req.params.id;
   const {   stok_adi, stok_tipi, birimi, barkodu, kdv_tipi, aciklama, olusturma_zamani } = req.body;
   const query = "UPDATE kart SET  stok_adi=?, stok_tipi=?, birimi=?, barkodu=?, kdv_tipi=?, aciklama=?, olusturma_zamani=? WHERE stok_kodu=?";
   const values = [ stok_adi, stok_tipi, birimi, barkodu, kdv_tipi, aciklama, olusturma_zamani,_id];

   connecttodb.query(query,values,(err,result)=>{
      if(err)console.log("güncellendi");
   });

});
// çalıştırma
app.listen(process.env.PORT, () => {
    console.log("server çalişti");
});

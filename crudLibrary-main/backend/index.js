import express from "express" //Rest Api kullanabilmek için projemize dahil ettik
import mysql from "mysql" //Projemizde veritabanı bağlantılarını kullanabilmek ve sorgu yazabilmek için 
                            //dahil ettik
import cors from "cors" //Backend projemizden frontend projemize bağlanabilmek için 
                        //bu paketi projemize dahil ettik

//Rest Api => Bir Rest apinin sonucu Json formatındadır.
//Aşağıdaki app objesi projemiz ayağa kaldırıldığında gerekli yapılandırmaları ve konfigürasyonları 
//sağlayarak projedeki endpointlerin (aşağıdaki fonksiyonların) local olarak kullanılmasına olanak sağlar.
const app = express()

//db adlı bir adet obje oluşturduk ve localimizdeki mysql sunucusuna bağlanabilmek için aşağıdaki gerekli
//değerleri doldurduk. Bu obje ile daha sonra projemiz ve veritabanımız arasında veri akışını sağlayacağız.
const db = mysql.createConnection({
    
     host:"localhost", //"Local instance MySQL80",
    user:"root",
    password:"1234",
    database:"library",
    insecureAuth : true

});

//yukarıda import ettiğimiz express ve cors paketlerini app adlı objenin yapılandırılması için kullandık.
app.use(express.json());
app.use(cors());

//Request (istek)  => Bir api'nin kullanılabilmesi için sorgu veya gövde şeklinde gönderilen isteklerdir.
//Response (cevap) => Bir api'nin atılan istek sonucu verdiği cevaptır.

//get protokolü => Bu metod sunucudan veri almak için kullanılır.
//post protokolü => Sunucuya genellikle bir veri göndermek (eklemek) için kullanılır.
//put protokolü => Sunucudaki kayıt veya kayıtları güncellemek için kullanılır.
//delete protokolü => Sunucudaki kayıt veya kayıtları silmek için kullanılır.

//Eğer url üzerinde localhost dışında bir isteğe çıkılmazsa aşağıdaki gibi bize 'hello this is the backend' 
//çıktısı json tipinde döndürülecek. 
//Bu apide Request göndermiyoruz
app.get("/", (req,res)=>{
    res.json("hello this is the backend")
})


//Url'in sonuna '/books' yazıldığında ve request gönderilmediğinde aşağıdaki metot tetiklenecektir.
//Bu apide Request göndermiyoruz
// 'q' adlı bir değişken ile bütün kitapları getireceğimiz sorgumuzu oluşturduk.
//Daha sonra db.query(...) fonksiyonu ile sorgumuzu veritabanında çalıştırıp sonucunu data değeri ile aldık.
//Bir hata oluşmasına karşın if() bloğu ile hatamızı hem konsolda hem de json tipinde döndürdük.
app.get("/books", (req,res)=>{
    const q = "SELECT * FROM books"
    db.query(q,(err,data)=>{
        if (err){ 
         console.log(err);
         return res.json(err)
        }
        return res.json(data)
    });
});


//Url'in sonuna '/books' yazıldığında ve request gönderildiğinde aşağıdaki metot tetiklenecektir.
//Aşağıdaki metot sunucuya yeni bir kayıt ekleyecektir.
// 'q' adlı bir değişken ile yeni bir kitap ekleyeceğimiz sorgumuzu oluşturduk.
//Bir hata oluşmasına karşın if() bloğu ile hatamızı hem konsolda hem de json tipinde döndürdük.

app.post("/books", (req,res)=>{
    const q = "INSERT INTO books (`id`,`title`,`desc`,`price`,`cover`) VALUES (?)"

    // values adlı dizi requestten gelen eklenmesi istenen kolonlara ait değerleri tutmaktadır.
    const values = [req.body.id, req.body.title, req.body.desc, req.body.price, req.body.cover];

    // Tablomuza eklenecek olan değerler (values) ilgili sorgumuz içerisine (q değişkeni) aşağıdaki 
    //db.query(...) fonksiyonu ile beraber ekleniyor. Bu şekilde kayıt işlemimiz gerçekleşiyor.
    db.query(q,[values], (err, data) =>{
        if (err){ 
            console.log(err);
            return res.json(err)
           }
        return res.json("Book has been created successfully");
    });
});

//Url'in sonuna '/books?idDeğeri' yazıldığında ve delete protokolü ile request gönderildiğinde aşağıdaki metot tetiklenecektir.
//Aşağıdaki metot sunucudan bir kayıt silecektir.
// 'q' adlı bir değişken ile bir kitap sileceğimiz sorgumuzu oluşturduk.
//Bir hata oluşmasına karşın if() bloğu ile hatamızı hem konsolda hem de json tipinde döndürdük.
app.delete("/books/:id", (req,res)=>{
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE id = ?"

    db.query(q,[bookId], (err,data)=>{
        if (err){ 
            console.log(err);
            return res.json(err)
           }
        return res.json("Book has been deleted successfully.");
    });
});


//Url'in sonuna '/books?idDeğeri' yazıldığında ve put protokolü ile request gönderildiğinde aşağıdaki metot tetiklenecektir.
//Aşağıdaki metot sunucudan bir kayıt silecektir.
// 'q' adlı bir değişken ile bir kitap sileceğimiz sorgumuzu oluşturduk.
//Bir hata oluşmasına karşın if() bloğu ile hatamızı hem konsolda hem de json tipinde döndürdük.
app.put("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?";

    const values=[
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ]

    db.query(q, [...values,bookId], (err, data) => {
        if (err){ 
            console.log(err);
            return res.json(err)
           }
        return res.json("Book has been updated successfully!")
    });
});

app.listen(8800, ()=>{
    console.log("Connected to backend!")
});
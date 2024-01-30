import React, { useEffect, useState } from 'react'; //react ile çalışabilmek için projemize dahil ettik
//useState => //bir url'den başka bir url'e yönlendirme yapabilmek için kullandık.
import axios from 'axios'; //axios bir protokol kullanılarak bir servise istek atılması için kullanılır
import { Link } from 'react-router-dom'; //Bir link verilerek yönlendirme yapılmasını sağlar. 

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    //Asenkron olarak çalışan bu fonksiyon axios kullanılarak kitapları getireceğimiz backend tarafındaki /books
     //endpointine yönlendirilip bu servis çağırılmaktadır.
    const fetchAllBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8800/books")
        //kitap bilgilerini setBooks isimli fonksiyona parametre olarak gönderdik.
        setBooks(res.data)
        //Bir problem yaşanırsa konsolda hata yazdırılsın diye catch bloğu kullandık.
      } catch (err) {
        console.log(err)
      }
    }

    fetchAllBooks();
  }, []);

  //Sayfalama ekranında her bir kitap için silme butonu da mevcut. Bu buton ile silme işlemi gerçekleştikten sonra
  //silinen kitap kaydı gösterilmesin diye silme işleminden sonra listeleme işlemleri tekrarlanıyor.
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/books/${id}`);
      setBooks((prevBooks) => prevBooks.filter(book => book.id !== id)); // Update state without refreshing the page
    } catch (err) {
      console.log(err)
    }
  }
  //Aşağıda Array ifadesi ile başlayan kısımda eğer ki listelenecek bir kitap kaydı bulamadıysak 'No books available'
  //ifadesini çıkarıyoruz.
  //Ancak listelenecek kitaplar mevcut ise o zaman backenddeki listeleme apisinden dönen cevaptaki tüm kitapları
  //sayfamıza sırasıyla bütün değerleri ile giydiriyoruz.  
  return (
    <div>
      <h1 className='title'>My Car Shelf</h1>
      <div className="books">
        {Array.isArray(books) && books.length > 0 ? (
          books.map(book => (
            <div className="book" key={book.id}>
              {book.cover && <img src={book.cover} alt="" />}
              <h2>{book.title}</h2>
              <p>{book.desc}</p>
              <span>{book.price}</span>
              <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
              <button className="update"><Link to={`/update/${book.id}`}>Update</Link></button>
            </div>
          ))
        ) : (
          <p>No Car available</p>
        )}
      </div>
      <button className='addBtn'>
        <a className='linkHref' href="/add">Add new Car</a>
      </button>
    </div>
  );
} //Yukarıdaki buton kitap ekleme sayfasına yönlendirmektedir.

export default Books;
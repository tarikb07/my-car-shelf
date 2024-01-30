import axios from 'axios'; //axios bir protokol kullanılarak bir servise istek atılması için kullanılır
import React from 'react'  //react ile çalışabilmek için projemize dahil ettik

import { useState } from 'react'
import { useNavigate } from 'react-router-dom' //bir url'den başka bir url'e yönlendirme yapabilmek için kullandık.

//Add diye bir obje oluşturduk ve içerisine alabileceği değerler için null ve empty değerler bıraktık
const Add = () => {
  const [book,setBook] = useState({
    title: "",
    desc: "",
    price: "",
    cover: "",
  });

  //useNavigate fonksiyonunu bir objeye taşıdık.
  const navigate = useNavigate()
  
  const handleChange = (e) =>{
    setBook(prev=>({ ...prev, [e.target.name]: e.target.value }));
  };

  //Asenkron olarak çalışan bu fonksiyon axios kullanılarak kitap ekleyeceğimiz backend tarafındaki /books endpointine
  //yönlendirilip bu servis çağırılmaktadır.
  const handleClick = async e =>{
    e.preventDefault()
    try{
        await axios.post("http://localhost:8800/books", book)
        //Ekleme işlemi bittikten sonra bizi tekrardan kitapların listelendiği sayfaya yönlendirmesini istedik
        navigate("/")
      //Bir hata meydana gelirse konsol loglarına hata değeri yazdırılacak.
    }catch(err){
        console.log(err);
    }
  }

  console.log(book)
  //Aşağıda tasarım ekranımızda ekleme yapacağımız kitabın bilgilerini doldurmak için form ekranı oluşturduk.
  //Bu form ekranında id title desc price ve cover değerleri için text inputları oluşturduk.
  //Aşağıda oluşturulan buton ise bu form'u post etmektedir. Bunu onClick özelliğinde yönlendirdiğimiz handleClick
  //adlı fonksiyon ile beraber yapmaktadır. 
  return (
    <div className='form'>
        <h1>Add New Car</h1>
        <input type="number" placeholder='id' onChange={handleChange} name="id"/>
        <input type="text" placeholder='title' onChange={handleChange} name="title"/>
        <input type="text" placeholder='desc' onChange={handleChange} name="desc"/>
        <input type="text" placeholder='price' onChange={handleChange} name="price"/>
        <input type="text" placeholder='cover' onChange={handleChange} name="cover"/>
    <button className="formButton" onClick={handleClick}>Add</button>
    </div>
  )
}

export default Add
import { MongoClient } from "mongodb";
export default async function handler(req, res) {
  //   const client = await MongoClient.connect(
  //     "mongodb+srv://admin:santur9292@vito-mohagheghian-portf.nciqc.mongodb.net/portfolio?retryWrites=true&w=majority"
  //   );
  //   const db = client.db();
  //   const postsCollection = db.collection("about_page");

  //   const postDocuments = await postsCollection.find({}).toArray();
  //   console.log(postDocuments);
  //   res.status(200).json(JSON.stringify(postDocuments));
  const client = await MongoClient.connect(
    "mongodb+srv://admin:santur9292@vito-mohagheghian-portf.nciqc.mongodb.net/portfolio?retryWrites=true&w=majority"
  );
  const db = client.db();

  const postsCollection = db.collection("blog_page");

  await postsCollection.insertOne({
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    previewImgSrc: "https://images2.imgbox.com/80/5e/IyiTC07X_o.png",
    previewText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing t, consectetur adipiscing elit. Phasellus aliquet nibh id iaculis pharetra. Maecenas at leo non ligula congue cursus. Integer rhoncus urna tellus, fermentum ultrices risus finibus quis. In non pretium metus, quis ornare nunc. Phasellus sollicitudin consequat enim, vel ullamcorper tellus laoreet a. Morbi eleifend dictum justo, vel blandit enim euismod quis. Duis auctor sapien at mauris iaculis, nec ultricies ipsum interdum. Aliquam eu est nec nibh tempus posuere eleifend sed ex. Donec quis magna sed felis elementum blandit nec quis sem. Maecenas eros neque, iaculis interdum lectus gravida, blandit dapibus quam. Donec vitae massa molestie, euismod tortor nec, aliquam magna. Donec imperdiet sit amet magna ut consectetur. Aenean varius, ligula nec ullamcorper volutpat, lorem dui consequat neque, eu porttitor felis ante ut est.",
    time: 2345234895792,
    date: "2020/2/20",
    viewsCount: 23,
    likesCount: 21,
    categories: ["all"],
    author: "Vito.mohagheghian",
    body: "<main className='blog_main'><h1>Lorem ipsum dolor sit amet, consectetur adipiscing</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing t, consectetur adipiscing elit. Phasellus aliquet nibh id iaculis pharetra. Maecenas at leo non ligula congue cursus. Integer rhoncus urna tellus, fermentum ultrices risus finibus quis. In non pretium metus, quis ornare nunc. Phasellus sollicitudin consequat enim, vel ullamcorper tellus laoreet a. Morbi eleifend dictum justo, vel blandit enim euismod quis. Duis auctor sapien at mauris iaculis, nec ultricies ipsum interdum. Aliquam eu est nec nibh tempus posuere eleifend sed ex. Donec quis magna sed felis elementum blandit nec quis sem. Maecenas eros neque, iaculis interdum lectus gravida, blandit dapibus quam. Donec vitae massa molestie, euismod tortor nec, aliquam magna. Donec imperdiet sit amet magna ut consectetur. Aenean varius, ligula nec ullamcorper volutpat, lorem dui consequat neque, eu porttitor felis ante ut est</p><img src='https://images2.imgbox.com/80/5e/IyiTC07X_o.png' alt='' /><p>Lorem ipsum dolor sit amet, consectetur adipiscing t, consectetur adipiscing elit. Phasellus aliquet nibh id iaculis pharetra. Maecenas at leo non ligula congue cursus. Integer rhoncus urna tellus, fermentum ultrices risus finibus quis. In non pretium metus, quis ornare nunc. Phasellus sollicitudin consequat enim, vel ullamcorper tellus laoreet a. Morbi eleifend dictum justo, vel blandit enim euismod quis. Duis auctor sapien at mauris iaculis, nec ultricies ipsum interdum. Aliquam eu est nec nibh tempus posuere eleifend sed ex. Donec quis magna sed felis elementum blandit nec quis sem. Maecenas eros neque, iaculis interdum lectus gravida, blandit dapibus quam. Donec vitae massa molestie, euismod tortor nec, aliquam magna. Donec imperdiet sit amet magna ut consectetur. Aenean varius, ligula nec ullamcorper volutpat, lorem dui consequat neque, eu porttitor felis ante ut est</p></main>",
    comments: [
      {
        name: "Vito",
        email: "vito.adfasd",
        time: "189374192834",
        replies: [
          {
            name: "Ali",
            email: "al.asdfasdf",
            repilies: [
              {
                name: "Hassan",
                email: "al.asdfasdf",
                repilies: [],
                time: "199374992834",
              },
            ],
            time: "199374192834",
          },
        ],
      },
    ],
  });

  client.close();
  console.log(res);
  res.status(200).json({ message: "successful" });
}

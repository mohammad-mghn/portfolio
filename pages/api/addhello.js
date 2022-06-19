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

  const postsCollection = db.collection("about_page");

  await postsCollection.insertOne({
    autobiography:
      "In 2005, I was born inEsfahatly I’m living in Esfahatly I’m living in Esfafahatly I’m living in Esfahatly I’m living in Esfafahatly I’m living in Esfahatly I’m living in Esfafahatly I’m living in Esfahatly I’m living in Esfafahatly I’m living in Esfahatly I’m living in Esfahan. Since 2020, I started learning the programming profession. At first, I was working with Python, over time I changed my mind, and today, I’m a web developer generally. I’m interested in Web development, especially Front-end, as well as UI / UX, and SEO. I’ve been developing websites in JavaScript since 2021. You probably know which I’m creating content about programming, and techs in some social media like Instagram, and so on. It’s clear that I’m aLinux fan, and to get to know me better, I provided some information about myself myself below.",
    skills: {
      leftSide: [ 
        { title: "Javascript", rate: 75 },
        { title: "Html/Css", rate: 50 },
        { title: "UI/UX", rate: 60 },
        { title: "Git/Github", rate: 10 },
        { title: "Word", rate: 20 },
        { title: "cmd", rate: 20 },
        { title: "SEO", rate: 60 },
        { title: "Javascript", rate: 10 },
      ],
      rightSide: [
        { title: "React.js", rate: 60 },
        { title: "Next.js", rate: 90 },
        { title: "Responsive Design", rate: 100 },
        { title: "Ps/Pr adobe", rate: 10 },
        { title: "Web security", rate: 60 },
        { title: "Test/debugging", rate: 40 },
        { title: "Teamwork", rate: 100 },
        { title: "Bootstrap/SASS", rate: 10 },
      ],
    },
    tools: {
      leftSide: [
        { title: "Javascript", rate: 75 },
        { title: "Html/Css", rate: 50 },
        { title: "UI/UX", rate: 60 },
        { title: "Git/Github", rate: 10 },
        { title: "Word", rate: 20 },
        { title: "cmd", rate: 20 },
        { title: "SEO", rate: 60 },
        { title: "Javascript", rate: 10 },
      ],
      rightSide: [
        { title: "React.js", rate: 60 },
        { title: "Next.js", rate: 90 },
        { title: "Responsive Design", rate: 100 },
        { title: "Ps/Pr adobe", rate: 10 },
        { title: "Web security", rate: 60 },
        { title: "Test/debugging", rate: 40 },
        { title: "Teamwork", rate: 100 },
        { title: "Bootstrap/SASS", rate: 10 },
      ],
    },
    languages: {
      leftSide: [{ title: "Javascript", rate: 75 }],
      rightSide: [{ title: "React.js", rate: 60 }],
    },
  });

  client.close();

  res.status(200).json({ message: "successful" });
}

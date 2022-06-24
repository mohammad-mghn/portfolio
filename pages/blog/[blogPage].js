import React, { useEffect, useState } from "react";

import Header from "../../modules/head";
import LoadingPage from "../../components/loadingPage";
import BlogReadPage from "../../components/blogReadPage";

import { MongoClient, ObjectId } from "mongodb";

import styles from "../../styles/blogPage.module.css";

const BlogPage = ({ blogArray }) => {
  const blog = blogArray[0];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [blog]);

  return (
    <>
      <Header
        title={`Vito Mohagheghian • ${blog.title}`}
        description={blog.title}
      />
      <LoadingPage visibility={loading} />
      <main className={styles.main_container}>
        <BlogReadPage blog={blog} />
      </main>
    </>
  );
};

export default BlogPage;

export async function getServerSideProps(context) {
  const { params } = context;
  const blogId = params.blogPage;
  const client = await MongoClient.connect(
    "mongodb+srv://admin:santur9292@vito-mohagheghian-portf.nciqc.mongodb.net/portfolio?retryWrites=true&w=majority"
  );
  const db = client.db();
  const postsCollection = db.collection("blog_page");

  const postsGettedCollection = await postsCollection
    .find({ _id: ObjectId(blogId) })
    .toArray();

  return {
    props: {
      blogArray: postsGettedCollection.map((blog) => ({
        _id: blogId,
        title: blog.title,
        previewImgSrc: blog.previewImgSrc,
        previewText: blog.previewText,
        time: blog.time,
        date: blog.date,
        viewsCount: blog.viewsCount,
        likesCount: blog.likesCount,
        categories: blog.categories,
        author: blog.author,
        body: blog.body,
        comments: blog.comments,
      })),
    },
  };
}

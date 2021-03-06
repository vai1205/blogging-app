import fetch from "isomorphic-fetch";
import { API } from "../config";

export const createBlog = (blog, token) => {
  return fetch(`${API}/blog`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: blog
  })
    .then(resp => {return resp.json()})
    .catch(err => console.log(err));
};

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
  const data = {limit, skip};
  return fetch(`${API}/blogs-categories-tags`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(resp => {return resp.json()})
    .catch(err => console.log(err));
};

export const singleBlog = slug => {
  return fetch(`${API}/blog/${slug}`,{
    method: "GET"
  }).then(resp => {
    return resp.json()})
    .catch(err => console.log(err));
};

export const listRelated = blog => {
  return fetch(`${API}/blogs/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(blog)
  })
    .then(resp => {return resp.json()})
    .catch(err => console.log(err));
};

export const list = () => {
  return fetch(`${API}/blogs`,{
    method: "GET"
  }).then(resp => {
    return resp.json()})
    .catch(err => console.log(err));
};

export const removeBlog = (slug, token) => {
  return fetch(`${API}/blog/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
  })
    .then(resp => {return resp.json()})
    .catch(err => console.log(err));
};

export const updateBlog = (blog, token, slug) => {
  return fetch(`${API}/blog/${slug}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: blog
  })
    .then(resp => {return resp.json()})
    .catch(err => console.log(err));
};

export const blogImageUrl = slug => {
  return fetch(`${API}/blog/photo/${slug}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
  .then(resp => {return resp.url})
  .catch(err => console.log(err));
}
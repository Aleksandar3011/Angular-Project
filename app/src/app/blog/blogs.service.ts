import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Router } from "@angular/router";

import { Subject } from 'rxjs'
import { map } from 'rxjs'

import { environment } from "src/environments/environment";
import { IBlog } from "./blog.model";

const BACKEND_URL = environment.apiUrl + '/blogs/';

@Injectable({
  providedIn: 'root'
})

export class BlogsService {
  private blogs: IBlog[] = [];
  private blogsUpdated = new Subject<{ blogs: IBlog[]; blogsCount: number}>();

  constructor(private http: HttpClient, private router: Router) {  }

  getBlogs(blogsPerPage: number, currentBlog: number){
    const queryParams = `?pagesize=${blogsPerPage}&page=${currentBlog}`;
    this.http.get<{message: string, blogs: any, maxBlogs: number}>(BACKEND_URL + queryParams)
      .pipe(map((blogData) => {
        return { blogs: blogData.blogs.map((blog: { _id: any; title: any; content: any; imagePath: any; creator: any}) => ({
          id: blog._id,
          title: blog.title,
          content: blog.content,
          imagePath: blog.imagePath,
          creator: blog.creator
        })), maxBlogs: blogData.maxBlogs}
      }))
      .subscribe((transformedBlogsData) => {
        this.blogs = transformedBlogsData.blogs;
        this.blogsUpdated.next({blogs:[...this.blogs], blogsCount: transformedBlogsData.maxBlogs});
      });
  }

  getBlogUpdateListener() {
    return this.blogsUpdated.asObservable()
  }

  getBlog(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(BACKEND_URL + id);
  }

  addBlog(title: string, content: string, image: string){
    const blogData = new FormData();
    blogData.append("title", title);
    blogData.append("content", content);
    blogData.append("image", image, title);
    this.http.post<{message: string, ad: IBlog}>(BACKEND_URL, blogData)
      .subscribe((responseData) => {
        this.router.navigate(["blog/dashboard"])

      });
  }


  updateBlog(id: string, title: string, content: string, image: string | undefined) {
    let blogData: IBlog | FormData;
    if (typeof image === "object") {
      blogData = new FormData();
      blogData.append("id", id);
      blogData.append("title", title);
      blogData.append("content", content);
      blogData.append("image", image, title);
    } else {
      blogData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(BACKEND_URL + id, blogData)
      .subscribe(response => {
        this.router.navigate(["blog/dashboard"])
      });
  }

  deleteBlog(blogId: string) {
   return this.http.delete(BACKEND_URL + blogId)
  }


}


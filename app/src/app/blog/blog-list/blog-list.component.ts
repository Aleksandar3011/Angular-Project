import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/auth/auth.service';

import { IBlog } from '../blog.model';
import { BlogsService } from '../blogs.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit, OnDestroy {

  blogs: IBlog[] = []
  private blogsSub!: Subscription;
  private authStatusSub!: Subscription;
  isLoading = false
  totalBlogs = 0;
  blogsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2 ,5, 10];
  userIsAuth = false;
  userId!: string;

  constructor(public blogService: BlogsService, private authService: AuthService) {  }

  ngOnInit(): void {
    this.isLoading = true;
    this.blogService.getBlogs(this.blogsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.blogsSub = this.blogService.getBlogUpdateListener()
      .subscribe((blogData: {blogs: IBlog[]; blogsCount: number}) => {
        this.isLoading = false;
        this.totalBlogs = blogData.blogsCount
        this.blogs = blogData.blogs
    });
    this.userIsAuth = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(isAuth => {
      this.userIsAuth = isAuth;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.blogsPerPage = pageData.pageSize;
    this.blogService.getBlogs(this.blogsPerPage, this.currentPage);

  }

  onDelete(blogId: string) {
    this.isLoading = true;
    this.blogService.deleteBlog(blogId).subscribe(() => {
      this.blogService.getBlogs(this.blogsPerPage, this.currentPage)
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.blogsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}

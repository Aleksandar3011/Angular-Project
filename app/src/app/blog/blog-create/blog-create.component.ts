import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { IBlog } from '../blog.model';
import { BlogsService } from '../blogs.service';
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css']
})
export class BlogCreateComponent implements OnInit, OnDestroy {
  enteredTitle = ``;
  enteredAboutUs = ``;

  blog: IBlog | any = {} as IBlog;
  isLoading = false;
  form!: FormGroup;
  imagePreview!: string;

  private authStatusSub!: Subscription;
  private mode = '';
  private blogId: any;

  constructor(public blogService: BlogsService, public route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      })
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('blogId')) {
        this.mode = 'edit';
        this.blogId = paramMap.get('blogId');
        this.isLoading = true;
        this.blogService.getBlog(this.blogId).subscribe(blogData => {
          this.isLoading = false;
          this.blog = { id: blogData._id, title: blogData.title, content: blogData.content, imagePath: blogData.imagePath, creator: blogData.creator}
          this.form.setValue({ 'title': this.blog.title, 'content': this.blog.content, 'image': this.blog.imagePath });
        });
      } else {
        this.mode = 'create';
        this.blogId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement as any).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  onSaveAd() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode == 'create') {
      this.blogService.addBlog(this.form.value.title, this.form.value.content, this.form.value.image)
    } else {
      this.blogService.updateBlog(this.blogId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}

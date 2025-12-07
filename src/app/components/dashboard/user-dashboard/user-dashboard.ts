import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user-service';
import { PostService } from '../../../services/post-service';
import { Iuser, NewUser } from '../../../models/user.model';
import { Ipost } from '../../../models/post.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.html',
})
export class UserDashboard implements OnInit {
  userList: Iuser[] = [];
  postList: Ipost[] = [];
  ceratedUser: Iuser | null = null;
  isLoading = false;
  statusMessage: string = '';
  newUserToSend: NewUser = {
    name: 'Pardis',
    username: 'Pardis82',
    email: 'Pardis82@gmail.com',
    address: {
      street: 'Farjam',
    },
  };
  constructor(private userService: UserService, private postService: PostService) {}
  ngOnInit() {
    this.loadUsers();
    this.loadPosts();
  }

  loadUsers() {
    this.isLoading = true;
    this.statusMessage = 'fetching Users ...';
    this.userService.getUsers().subscribe({
      next: (data) => {
        (this.userList = data), (this.statusMessage = `successfully got ${data.length} users`);
      },
      error: (err) => {
        (this.statusMessage = `failed to get due to ${err.message}`),
          console.log('Get Error:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  createUsers() {
    this.isLoading = true;
    this.statusMessage = 'creating a user...';
    this.ceratedUser = null;
    this.userService.postUsers(this.newUserToSend).subscribe({
      next: (user) => {
        (this.ceratedUser = user),
          this.userList.push(user),
          (this.statusMessage = `successfully added ${user.name} to user list`);
      },
      error: (err) => {
        (this.statusMessage = `Failed to create user due to ${err.message}`),
          console.log('Post Error:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  loadPosts() {
    this.isLoading = true;
    this.statusMessage = 'getting posts ...';
    this.postService.getPostsByUserId(1).subscribe({
      next: (post) => {
        this.postList = post;
      },
      error: (err) => {
        this.statusMessage = `Failed due to ${err.message}`;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}

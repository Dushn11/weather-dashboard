import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Dashboard } from '../../pages/dashboard/dashboard';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, Dashboard],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {}

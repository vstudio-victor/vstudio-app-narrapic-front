import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'ltz-sidebar-menu',
  imports: [NgClass, NgFor],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  activeMenu = 'Dashboard';
  menuItems: MenuItem[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'Team Overview', label: 'Team Overview', icon: 'users' },
    { id: 'Objectives Planning', label: 'Objectives Planning', icon: 'target' },
    { id: 'Absence Analytics', label: 'Absence Analytics', icon: 'chart' },
    { id: 'Reports', label: 'Reports', icon: 'reports' },
  ];

  getIcon(icon: string): string {
    return `assets/images/${icon}.svg`;
  }
}

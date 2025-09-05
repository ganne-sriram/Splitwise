import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { Group, GroupCreate } from '../../models/group.model';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">My Groups</h1>
            <button
              (click)="showCreateForm = !showCreateForm"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Create Group
            </button>
          </div>

          <!-- Create Group Form -->
          <div *ngIf="showCreateForm" class="bg-white shadow rounded-lg p-6 mb-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Create New Group</h2>
            <form (ngSubmit)="createGroup()">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">Group Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    [(ngModel)]="newGroup.name"
                    name="name"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">Description (Optional)</label>
                  <textarea
                    id="description"
                    [(ngModel)]="newGroup.description"
                    name="description"
                    rows="3"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter group description"
                  ></textarea>
                </div>
              </div>
              <div class="mt-4 flex space-x-3">
                <button
                  type="submit"
                  [disabled]="loading"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  {{ loading ? 'Creating...' : 'Create Group' }}
                </button>
                <button
                  type="button"
                  (click)="cancelCreate()"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Groups List -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              *ngFor="let group of groups"
              class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ group.name }}</h3>
                <p class="text-gray-600 text-sm mb-4">{{ group.description || 'No description' }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500">Created {{ group.created_at | date }}</span>
                  <a
                    [routerLink]="['/groups', group.id]"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="groups.length === 0" class="text-center py-12">
            <p class="text-gray-500 text-lg">No groups yet. Create your first group to get started!</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GroupsComponent implements OnInit {
  groups: Group[] = [];
  showCreateForm = false;
  loading = false;
  newGroup: GroupCreate = { name: '', description: '' };

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getUserGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
      },
      error: (err) => {
        console.error('Failed to load groups:', err);
      }
    });
  }

  createGroup(): void {
    if (!this.newGroup.name.trim()) {
      return;
    }

    this.loading = true;
    this.groupService.createGroup(this.newGroup).subscribe({
      next: (group) => {
        this.groups.push(group);
        this.cancelCreate();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to create group:', err);
        this.loading = false;
      }
    });
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.newGroup = { name: '', description: '' };
  }
}

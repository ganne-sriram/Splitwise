import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { GroupWithMembers } from '../../models/group.model';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50" *ngIf="group">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ group.name }}</h1>
              <p class="text-gray-600">{{ group.description || 'No description' }}</p>
            </div>
            <a routerLink="/groups" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
              Back to Groups
            </a>
          </div>

          <!-- Group Members -->
          <div class="bg-white shadow rounded-lg p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Group Members</h2>
              <button
                (click)="showAddMember = !showAddMember"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
              >
                Add Member
              </button>
            </div>

            <!-- Add Member Form -->
            <div *ngIf="showAddMember" class="mb-4 p-4 bg-gray-50 rounded-lg">
              <div class="flex space-x-3">
                <input
                  type="email"
                  [(ngModel)]="newMemberEmail"
                  placeholder="Enter member's email"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  (click)="addMember()"
                  [disabled]="!newMemberEmail.trim() || loading"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {{ loading ? 'Adding...' : 'Add' }}
                </button>
                <button
                  (click)="cancelAddMember()"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>

            <!-- Members List -->
            <div class="space-y-3">
              <div
                *ngFor="let member of group.members"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-medium text-gray-900">Member ID: {{ member.user_id }}</p>
                  <p class="text-xs text-gray-400">Joined {{ member.joined_at | date }}</p>
                </div>
                <button
                  *ngIf="member.user_id !== currentUserId"
                  (click)="removeMember(member.user_id)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              routerLink="/expenses"
              class="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center"
            >
              <h3 class="font-medium">Add Expense</h3>
              <p class="text-sm opacity-90">Record a new expense for this group</p>
            </a>
            <a
              routerLink="/settlements"
              class="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg text-center"
            >
              <h3 class="font-medium">Settle Up</h3>
              <p class="text-sm opacity-90">View balances and settle debts</p>
            </a>
            <a
              href="#"
              class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center"
            >
              <h3 class="font-medium">View Analytics</h3>
              <p class="text-sm opacity-90">See expense breakdown and charts</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GroupDetailsComponent implements OnInit {
  group: GroupWithMembers | null = null;
  showAddMember = false;
  newMemberEmail = '';
  loading = false;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const groupId = Number(this.route.snapshot.paramMap.get('id'));
    if (groupId) {
      this.loadGroup(groupId);
    }
    
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
      },
      error: (err) => {
        console.error('Failed to get current user:', err);
      }
    });
  }

  loadGroup(groupId: number): void {
    this.groupService.getGroup(groupId).subscribe({
      next: (group) => {
        this.group = group;
      },
      error: (err) => {
        console.error('Failed to load group:', err);
      }
    });
  }

  addMember(): void {
    if (!this.newMemberEmail.trim() || !this.group) return;
    
    this.loading = true;
    console.log('Add member functionality needs user lookup by email');
    this.loading = false;
  }

  removeMember(userId: number): void {
    if (!this.group) return;
    
    this.groupService.removeMember(this.group.id, userId).subscribe({
      next: () => {
        this.loadGroup(this.group!.id);
      },
      error: (err) => {
        console.error('Failed to remove member:', err);
      }
    });
  }

  cancelAddMember(): void {
    this.showAddMember = false;
    this.newMemberEmail = '';
  }
}

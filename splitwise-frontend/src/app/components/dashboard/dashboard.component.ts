import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">Splitwise</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">Welcome, {{ currentUser?.name }}</span>
              <button
                (click)="logout()"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Dashboard Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">$</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Net Balance</dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ dashboardData?.net_balance | currency }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">G</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Groups</dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ dashboardData?.total_groups || 0 }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">E</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Recent Expenses</dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ dashboardData?.recent_expenses?.length || 0 }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white shadow rounded-lg mb-8">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                routerLink="/groups"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-center font-medium"
              >
                View Groups
              </a>
              <a
                routerLink="/expenses"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-center font-medium"
              >
                Add Expense
              </a>
              <a
                routerLink="/settlements"
                class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-center font-medium"
              >
                Settle Up
              </a>
              <a
                routerLink="/analytics"
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-center font-medium"
              >
                View Analytics
              </a>
            </div>
          </div>
        </div>

        <!-- Recent Expenses -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Expenses</h3>
            <div *ngIf="dashboardData?.recent_expenses?.length > 0; else noExpenses">
              <div class="space-y-3">
                <div
                  *ngFor="let expense of dashboardData.recent_expenses"
                  class="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                >
                  <div>
                    <p class="font-medium text-gray-900">{{ expense.description }}</p>
                    <p class="text-sm text-gray-500">{{ expense.date | date }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900">{{ expense.amount | currency }}</p>
                    <p class="text-sm text-gray-500">{{ expense.category }}</p>
                  </div>
                </div>
              </div>
            </div>
            <ng-template #noExpenses>
              <p class="text-gray-500 text-center py-4">No recent expenses</p>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  dashboardData: any = null;

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.analyticsService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (err) => {
        console.error('Failed to load dashboard data:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { GroupService } from '../../services/group.service';
import { ExpenseCreate, ExpenseCategory, ExpenseWithParticipants } from '../../models/expense.model';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">Expenses</h1>
            <button
              (click)="showCreateForm = !showCreateForm"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Add Expense
            </button>
          </div>

          <!-- Add Expense Form -->
          <div *ngIf="showCreateForm" class="bg-white shadow rounded-lg p-6 mb-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Add New Expense</h2>
            <form (ngSubmit)="createExpense()">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    id="description"
                    type="text"
                    required
                    [(ngModel)]="newExpense.description"
                    name="description"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="What was this expense for?"
                  />
                </div>
                <div>
                  <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    required
                    [(ngModel)]="newExpense.amount"
                    name="amount"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="category"
                    [(ngModel)]="newExpense.category"
                    name="category"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="food">Food</option>
                    <option value="travel">Travel</option>
                    <option value="shopping">Shopping</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="utilities">Utilities</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label for="group" class="block text-sm font-medium text-gray-700">Group</label>
                  <select
                    id="group"
                    [(ngModel)]="newExpense.group_id"
                    name="group"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select a group</option>
                    <option *ngFor="let group of groups" [value]="group.id">{{ group.name }}</option>
                  </select>
                </div>
              </div>
              <div class="mt-4 flex space-x-3">
                <button
                  type="submit"
                  [disabled]="loading"
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  {{ loading ? 'Adding...' : 'Add Expense' }}
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

          <!-- Group Selection for Viewing Expenses -->
          <div class="bg-white shadow rounded-lg p-6 mb-6">
            <label for="selectedGroup" class="block text-sm font-medium text-gray-700 mb-2">View expenses for group:</label>
            <select
              id="selectedGroup"
              [(ngModel)]="selectedGroupId"
              (ngModelChange)="loadGroupExpenses()"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a group to view expenses</option>
              <option *ngFor="let group of groups" [value]="group.id">{{ group.name }}</option>
            </select>
          </div>

          <!-- Expenses List -->
          <div *ngIf="selectedGroupId" class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Group Expenses</h3>
            </div>
            <div class="divide-y divide-gray-200">
              <div
                *ngFor="let expense of expenses"
                class="px-6 py-4 hover:bg-gray-50"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">{{ expense.description }}</h4>
                    <p class="text-sm text-gray-500">{{ expense.date | date }} • {{ expense.category | titlecase }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">{{ expense.amount | currency }}</p>
                    <p class="text-xs text-gray-500">{{ expense.participants?.length || 0 }} participants</p>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="expenses.length === 0" class="px-6 py-8 text-center">
              <p class="text-gray-500">No expenses found for this group.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExpensesComponent implements OnInit {
  expenses: ExpenseWithParticipants[] = [];
  groups: Group[] = [];
  showCreateForm = false;
  loading = false;
  selectedGroupId: number | null = null;
  newExpense: ExpenseCreate = {
    description: '',
    amount: 0,
    category: ExpenseCategory.OTHER,
    group_id: 0,
    participants: []
  };

  constructor(
    private expenseService: ExpenseService,
    private groupService: GroupService
  ) {}

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

  loadGroupExpenses(): void {
    if (!this.selectedGroupId) {
      this.expenses = [];
      return;
    }

    this.expenseService.getGroupExpenses(this.selectedGroupId).subscribe({
      next: (expenses) => {
        this.expenses = expenses;
      },
      error: (err) => {
        console.error('Failed to load expenses:', err);
      }
    });
  }

  createExpense(): void {
    if (!this.newExpense.description.trim() || !this.newExpense.amount || !this.newExpense.group_id) {
      return;
    }

    this.loading = true;
    this.expenseService.createExpense(this.newExpense).subscribe({
      next: (expense) => {
        if (this.selectedGroupId === this.newExpense.group_id) {
          this.loadGroupExpenses();
        }
        this.cancelCreate();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to create expense:', err);
        this.loading = false;
      }
    });
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.newExpense = {
      description: '',
      amount: 0,
      category: ExpenseCategory.OTHER,
      group_id: 0,
      participants: []
    };
  }
}

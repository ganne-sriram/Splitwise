import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { SettlementService } from '../../services/settlement.service';
import { Group } from '../../models/group.model';
import { Settlement, SettlementCreate } from '../../models/settlement.model';

interface GroupBalance {
  user_id: number;
  user_name: string;
  total_paid: number;
  total_owes: number;
  net_balance: number;
}

interface GroupBalanceResponse {
  group_id: number;
  balances: GroupBalance[];
}

@Component({
  selector: 'app-settlements',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">Settle Up</h1>
          </div>

          <!-- Group Selection -->
          <div class="bg-white shadow rounded-lg p-6 mb-6">
            <label for="selectedGroup" class="block text-sm font-medium text-gray-700 mb-2">Select group to view balances:</label>
            <select
              id="selectedGroup"
              [(ngModel)]="selectedGroupId"
              (ngModelChange)="loadGroupBalances()"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a group</option>
              <option *ngFor="let group of groups" [value]="group.id">{{ group.name }}</option>
            </select>
          </div>

          <!-- Group Balances -->
          <div *ngIf="selectedGroupId && groupBalances" class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Group Balances</h3>
            </div>
            <div class="divide-y divide-gray-200">
              <div
                *ngFor="let balance of groupBalances.balances"
                class="px-6 py-4"
                [ngClass]="{
                  'bg-green-50': balance.net_balance > 0,
                  'bg-red-50': balance.net_balance < 0,
                  'bg-gray-50': balance.net_balance === 0
                }"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">{{ balance.user_name }}</h4>
                    <p class="text-sm text-gray-500">
                      Paid: {{ balance.total_paid | currency }} • 
                      Owes: {{ balance.total_owes | currency }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium" 
                       [ngClass]="{
                         'text-green-600': balance.net_balance > 0,
                         'text-red-600': balance.net_balance < 0,
                         'text-gray-600': balance.net_balance === 0
                       }">
                      <span *ngIf="balance.net_balance > 0">Gets back {{ balance.net_balance | currency }}</span>
                      <span *ngIf="balance.net_balance < 0">Owes {{ (-balance.net_balance) | currency }}</span>
                      <span *ngIf="balance.net_balance === 0">Settled up</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="groupBalances.balances.length === 0" class="px-6 py-8 text-center">
              <p class="text-gray-500">No expenses found for this group.</p>
            </div>
          </div>

          <!-- Settlement Suggestions -->
          <div *ngIf="selectedGroupId && groupBalances" class="bg-white shadow rounded-lg mt-6">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Suggested Settlements</h3>
            </div>
            <div class="px-6 py-4">
              <div *ngFor="let suggestion of getSettlementSuggestions()" class="mb-4 p-4 bg-blue-50 rounded-lg">
                <p class="text-sm font-medium text-blue-900">
                  {{ suggestion.from_name }} should pay {{ suggestion.to_name }} {{ suggestion.amount | currency }}
                </p>
                <button
                  (click)="recordSettlement(suggestion)"
                  class="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Record Settlement
                </button>
              </div>
              <div *ngIf="getSettlementSuggestions().length === 0" class="text-center py-4">
                <p class="text-gray-500">All settled up! 🎉</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettlementsComponent implements OnInit {
  groups: Group[] = [];
  selectedGroupId: number | null = null;
  groupBalances: GroupBalanceResponse | null = null;
  loading = false;

  constructor(
    private groupService: GroupService,
    private settlementService: SettlementService
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

  loadGroupBalances(): void {
    if (!this.selectedGroupId) {
      this.groupBalances = null;
      return;
    }

    this.groupService.getGroupBalances(this.selectedGroupId).subscribe({
      next: (balances) => {
        this.groupBalances = balances;
      },
      error: (err) => {
        console.error('Failed to load group balances:', err);
      }
    });
  }

  getSettlementSuggestions(): any[] {
    if (!this.groupBalances) return [];
    
    const suggestions: any[] = [];
    const balances = JSON.parse(JSON.stringify(this.groupBalances.balances));
    const creditors = balances.filter((b: GroupBalance) => b.net_balance > 0).sort((a: GroupBalance, b: GroupBalance) => b.net_balance - a.net_balance);
    const debtors = balances.filter((b: GroupBalance) => b.net_balance < 0).sort((a: GroupBalance, b: GroupBalance) => a.net_balance - b.net_balance);
    
    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      const amount = Math.min(creditor.net_balance, -debtor.net_balance);
      
      if (amount > 0.01) {
        suggestions.push({
          from_id: debtor.user_id,
          from_name: debtor.user_name,
          to_id: creditor.user_id,
          to_name: creditor.user_name,
          amount: amount
        });
      }
      
      creditor.net_balance -= amount;
      debtor.net_balance += amount;
      
      if (creditor.net_balance < 0.01) i++;
      if (debtor.net_balance > -0.01) j++;
    }
    
    return suggestions;
  }

  recordSettlement(suggestion: any): void {
    const settlementData: SettlementCreate = {
      to_user_id: suggestion.to_id,
      amount: suggestion.amount,
      description: `Settlement for group expenses`
    };

    this.settlementService.createSettlement(settlementData).subscribe({
      next: () => {
        this.loadGroupBalances();
      },
      error: (err) => {
        console.error('Failed to record settlement:', err);
      }
    });
  }
}

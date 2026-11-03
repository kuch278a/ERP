<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('reports API health without auth', function () {
    $this->getJson('/api/v1/health')
        ->assertOk()
        ->assertJsonPath('status', 'online')
        ->assertJsonStructure(['modules_active']);
});

it('logs in and returns a sanctum bearer token', function () {
    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'sarah@ashara-atelier.com',
        'password' => 'secret123',
    ]);

    $response->assertOk()
        ->assertJsonPath('message', 'success')
        ->assertJsonStructure(['data' => ['token', 'user']]);
});

it('rejects unauthenticated atelier requests', function () {
    $this->getJson('/api/v1/accounts/chart-of-accounts')->assertUnauthorized();
    $this->getJson('/api/v1/projects')->assertUnauthorized();
});

it('returns atelier projects and allows creating a new project', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->getJson('/api/v1/projects')
        ->assertOk()
        ->assertJsonStructure(['data']);

    $this->postJson('/api/v1/projects', [
        'name' => 'Bespoke Pavilion Jumeirah',
        'totalBudget' => 3500000,
        'designFee' => 280000,
        'stage' => 'Concept & Moodboards',
    ])->assertStatus(201)
      ->assertJsonPath('data.name', 'Bespoke Pavilion Jumeirah');
});

it('returns ffe items and toggles sample approval', function () {
    Sanctum::actingAs(User::factory()->create());

    $response = $this->getJson('/api/v1/ffe')->assertOk();
    $firstItem = $response->json('data.0');

    if ($firstItem) {
        $this->postJson("/api/v1/ffe/{$firstItem['id']}/toggle-sample")
            ->assertOk()
            ->assertJsonPath('data.sampleApproved', ! $firstItem['sampleApproved']);
    }
});

it('returns snags and allows creating a snag', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->getJson('/api/v1/snags')->assertOk();

    $this->postJson('/api/v1/snags', [
        'description' => 'Test snag on travertine facade',
        'severity' => 'Moderate',
    ])->assertStatus(201)
      ->assertJsonPath('data.description', 'Test snag on travertine facade');
});

it('returns invoices and allows creating an invoice', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->getJson('/api/v1/invoices')->assertOk();

    $this->postJson('/api/v1/invoices', [
        'milestone' => 'Phase 1 Schematic Approval',
        'amount' => 50000,
    ])->assertStatus(201)
      ->assertJsonPath('data.totalWithTax', 52500);
});

it('returns clients and allows creating a client', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->getJson('/api/v1/clients')->assertOk();

    $this->postJson('/api/v1/clients', [
        'name' => 'Sheikh Hamdan Estate Office',
        'email' => 'office@hamdan-estate.ae',
    ])->assertStatus(201)
      ->assertJsonPath('data.name', 'Sheikh Hamdan Estate Office');
});

it('returns the chart of accounts when authenticated', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->getJson('/api/v1/accounts/chart-of-accounts')
        ->assertOk()
        ->assertJsonPath('message', 'success')
        ->assertJsonStructure(['data']);
});

it('returns suppliers and purchase orders when authenticated', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->getJson('/api/v1/buying/suppliers')->assertOk()->assertJsonStructure(['data']);
    $this->getJson('/api/v1/buying/purchase-orders')->assertOk()->assertJsonStructure(['data']);
});

it('rejects an unbalanced journal entry', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->postJson('/api/v1/accounts/journal-entries', [
        'voucher_type' => 'Journal Entry',
        'posting_date' => '2026-10-01',
        'accounts' => [
            ['account' => '1110 - Cash', 'debit' => 100, 'credit' => 0],
            ['account' => '4110 - Income', 'debit' => 0, 'credit' => 90],
        ],
        'user_remark' => 'test',
    ])->assertStatus(422)->assertJsonPath('error', 'UnbalancedJournalEntry');
});

it('posts a balanced journal entry', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->postJson('/api/v1/accounts/journal-entries', [
        'voucher_type' => 'Journal Entry',
        'posting_date' => '2026-10-01',
        'accounts' => [
            ['account' => '1110 - Cash', 'debit' => 100, 'credit' => 0],
            ['account' => '4110 - Income', 'debit' => 0, 'credit' => 100],
        ],
        'user_remark' => 'balanced',
    ])->assertStatus(201)->assertJsonPath('data.docstatus', 1);
});

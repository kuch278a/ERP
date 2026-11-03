<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Projects
        Schema::create('atelier_projects', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. PRJ-2026-001
            $table->string('name');
            $table->string('type')->nullable();
            $table->string('location')->nullable();
            $table->string('area')->nullable();
            $table->string('client')->nullable();
            $table->string('clientId')->nullable();
            $table->decimal('totalBudget', 18, 2)->default(0);
            $table->decimal('designFee', 18, 2)->default(0);
            $table->decimal('invoicedAmount', 18, 2)->default(0);
            $table->string('stage')->default('Concept & Moodboards');
            $table->integer('progress')->default(0);
            $table->string('leadArchitect')->nullable();
            $table->string('leadId')->nullable();
            $table->date('startDate')->nullable();
            $table->date('targetHandover')->nullable();
            $table->string('image')->nullable();
            $table->string('health')->default('On Track');
            $table->string('aesthetic')->nullable();
            $table->text('description')->nullable();
            $table->json('phases')->nullable();
            $table->json('roomSchedule')->nullable();
            $table->timestamps();
        });

        // 2. FF&E Specification Schedule
        Schema::create('atelier_ffe_items', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. FFE-001
            $table->string('specCode')->nullable();
            $table->string('name');
            $table->string('category')->nullable();
            $table->string('room')->nullable();
            $table->string('projectId')->nullable()->index();
            $table->string('projectName')->nullable();
            $table->string('vendor')->nullable();
            $table->string('finish')->nullable();
            $table->string('dimensions')->nullable();
            $table->string('leadTime')->nullable();
            $table->decimal('unitCost', 18, 2)->default(0);
            $table->decimal('markupPct', 8, 2)->default(0);
            $table->decimal('clientPrice', 18, 2)->default(0);
            $table->integer('qty')->default(1);
            $table->boolean('sampleApproved')->default(false);
            $table->string('poStatus')->default('Spec Draft');
            $table->text('notes')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        // 3. Site Snags & QA Inspections
        Schema::create('atelier_snags', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. SNG-101
            $table->string('projectId')->nullable()->index();
            $table->string('projectName')->nullable();
            $table->string('location')->nullable();
            $table->text('description');
            $table->string('category')->nullable();
            $table->string('severity')->default('Moderate');
            $table->string('contractor')->nullable();
            $table->string('loggedBy')->nullable();
            $table->date('dateLogged')->nullable();
            $table->date('dueDate')->nullable();
            $table->string('status')->default('Open');
            $table->string('photoUrl')->nullable();
            $table->text('rectificationPlan')->nullable();
            $table->timestamps();
        });

        // 4. Sales Invoices
        Schema::create('atelier_invoices', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. INV-2026-089
            $table->string('projectId')->nullable()->index();
            $table->string('projectName')->nullable();
            $table->string('clientName')->nullable();
            $table->string('milestone')->nullable();
            $table->decimal('amount', 18, 2)->default(0);
            $table->date('issueDate')->nullable();
            $table->date('dueDate')->nullable();
            $table->string('status')->default('Pending');
            $table->decimal('taxRate', 5, 2)->default(5.00);
            $table->decimal('totalWithTax', 18, 2)->default(0);
            $table->string('paymentMethod')->nullable();
            $table->timestamps();
        });

        // 5. Clients CRM
        Schema::create('atelier_clients', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. CLI-001
            $table->string('name');
            $table->string('type')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('city')->nullable();
            $table->string('stylePreference')->nullable();
            $table->json('activeProjects')->nullable();
            $table->decimal('lifetimeValue', 18, 2)->default(0);
            $table->string('status')->default('Active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('atelier_clients');
        Schema::dropIfExists('atelier_invoices');
        Schema::dropIfExists('atelier_snags');
        Schema::dropIfExists('atelier_ffe_items');
        Schema::dropIfExists('atelier_projects');
    }
};

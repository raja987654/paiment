import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CommonModule } from '@angular/common'; // Import nécessaire pour les directives comme *ngIf

@Component({
  selector: 'app-root',
  standalone: true, // Marque le composant comme autonome
  imports: [CommonModule], // Import des modules nécessaires
  template: `
    <div>
      <h1>Stripe Payment</h1>
      <form (submit)="handlePayment($event)">
        <div #cardElement id="card-element"></div>
        <button type="submit" [disabled]="isProcessing">
          {{ isProcessing ? 'Processing...' : 'Pay Now' }}
        </button>
      </form>
      <div *ngIf="paymentStatus" class="status">{{ paymentStatus }}</div>
    </div>
  `,
  styles: [`
    #card-element {
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 15px;
      border-radius: 5px;
    }
    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
    .status {
      margin-top: 15px;
      font-weight: bold;
      color: green;
    }
  `]
})
export class AppComponent implements OnInit {
  @ViewChild('cardElement') cardElement!: ElementRef;
  stripe!: Stripe | null;
  card!: any;
  isProcessing: boolean = false;
  paymentStatus: string = '';

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51QUPkEIr5V57YW0l40DtIdWvGAmXhlE51ybNTOy97P04JOZK6IWm2Ce7ICSddyYrODcrcUEtzFBNQJpbsEF9osvn00YClq3Z9M'); // Remplacez par votre clé publique Stripe
    const elements = this.stripe?.elements();
    if (elements) {
      this.card = elements.create('card');
      this.card.mount(this.cardElement.nativeElement);
    }
  }

  async handlePayment(event: Event) {
    event.preventDefault();
    this.isProcessing = true;

    if (!this.stripe || !this.card) {
      this.paymentStatus = 'Stripe.js is not loaded.';
      this.isProcessing = false;
      return;
    }

    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      this.paymentStatus = `Payment failed: ${error.message}`;
    } else {
      this.paymentStatus = `Payment successful! Token ID: ${token?.id}`;
      console.log('Token:', token); // Simulez l'envoi de ce token à votre backend si nécessaire.
    }

    this.isProcessing = false;
  }
}

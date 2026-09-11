import React from "react";
import { CreditCard, Check, ArrowLeft } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import { usePricing } from "../../hooks/usePricing";
import "./Pricing.css";

/**
 * Pricing Section — Eleven Reader & Apple inspired.
 * Pure Light Mode, editorial typography, zero clutter, no unsolicited badges.
 */
export default function PricingSection() {
  const { yearly, toggleBilling, plans, handleSelectPlan } = usePricing();

  return (
    <section id="pricing" className="pricing-section" dir="rtl">
      <div className="pricing-container">
        {/* Editorial Section Header */}
        <SectionHeader
          icon={CreditCard}
          eyebrow="الاشتراكات والأسعار"
          title="خطط واضحة وبسيطة تناسب احتياجك"
          align="center"
          theme="light"
        />

        {/* Apple-style Billing Segmented Toggle */}
        <div className="pricing-billing-wrap">
          <div className="pricing-billing-segmented" role="group" aria-label="فترة الفوترة">
            <button
              type="button"
              className={`pricing-billing-btn ${!yearly ? "is-active" : ""}`}
              onClick={() => toggleBilling(false)}
            >
              شهري
            </button>
            <button
              type="button"
              className={`pricing-billing-btn ${yearly ? "is-active" : ""}`}
              onClick={() => toggleBilling(true)}
            >
              سنوي
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-grid">
          {plans.map((plan) => {
            const price = yearly ? plan.priceYearly : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`pricing-card ${plan.highlight ? "is-highlighted" : ""}`}
                onClick={() => handleSelectPlan(plan)}
              >
                {/* Header: Plan Name */}
                <div className="pricing-card-header">
                  <h3 className="pricing-card-name">{plan.name}</h3>
                </div>

                {/* Price Display */}
                <div className="pricing-price-wrap">
                  <div className="pricing-price-row">
                    <span className="pricing-price-amount">{price}</span>
                    <div className="pricing-price-meta">
                      <span className="pricing-price-currency">$</span>
                      <span className="pricing-price-period">
                        / {yearly ? "سنة" : "شهر"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features Checklist */}
                <ul className="pricing-features-list">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="pricing-feature-item">
                      <span className="pricing-check-icon" aria-hidden="true">
                        <Check size={16} strokeWidth={2.6} />
                      </span>
                      <span className="pricing-feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Card CTA Action */}
                <div className="pricing-card-action-wrap">
                  <button
                    type="button"
                    className={`pricing-action-btn ${
                      plan.highlight ? "is-primary" : "is-secondary"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(plan);
                    }}
                    aria-label={`${plan.buttonText} - ${plan.name}`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowLeft size={14} strokeWidth={2.4} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

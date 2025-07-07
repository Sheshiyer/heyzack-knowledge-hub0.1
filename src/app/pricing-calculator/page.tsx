'use client';

import { useState, useMemo, useEffect } from 'react';
import { Calculator, Download, Save, Upload, Plus, Minus, Package, TrendingUp, BarChart3, Target, Users, DollarSign } from 'lucide-react';

// Utility function to format numbers consistently across server and client
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

interface Product {
  id: string;
  name: string;
  model: string;
  supplier: string;
  cost: number;
  category: 'security' | 'automation' | 'energy' | 'comfort' | 'pet';
}

interface KitTemplate {
  id: string;
  name: string;
  description: string;
  baseProducts: string[];
  targetPrice: {
    earlyBird: number;
    standard: number;
    retail: number;
  };
}

interface PricingInputs {
  shippingFees: number;
  platformFee: number;
  paymentProcessingFee: number;
  targetMarginLow: number;
  targetMarginHigh: number;
  targetDiscountLow: number;
  targetDiscountHigh: number;
  globalMarkupPercentage: number;
  globalCAC: number;
  targetKitMargin: number;
}



interface PriceSelection {
  vipPrice: number;
  lowDiscountMSRP: number;
  highDiscountMSRP: number;
  yourMSRP: number;
  earlyBirdDiscountPercent: number;
  standardDiscountPercent: number;
  autoCalculateMSRP: boolean;
}

interface CalculationResults {
  finalPrices: {
    finalMSRP: number;
    finalVIPPrice: number;
    finalDollarDiscount: number;
    finalPercentDiscount: number;
    finalProfit: number;
    finalMargin: number;
  };
  revenue: {
    price: number;
    shipping: number;
    totalRevenue: number;
  };
  costs: {
    cogs: number;
    shipping: number;
    platformFee: number;
    paymentFee: number;
    totalCosts: number;
  };
  profit: {
    totalProfit: number;
    profitMargin: number;
  };
}

const PRODUCTS: Product[] = [
  { id: 'doorbell-battery', name: 'Battery Video Doorbell', model: 'IPB192', supplier: 'Omnia', cost: 20, category: 'security' },
  { id: 'doorbell-2k', name: '2K Video Doorbell', model: 'SC162-WCD3', supplier: 'Tuya', cost: 29.5, category: 'security' },
  { id: 'camera-battery', name: 'Battery Solar Camera', model: 'IPC197', supplier: 'Omnia', cost: 20, category: 'security' },
  { id: 'camera-2k', name: '2K Battery Camera', model: 'SC155-WQ3', supplier: 'Tuya', cost: 21, category: 'security' },
  { id: 'camera-2k-solar', name: '2K Battery Camera - Solar', model: 'SC155-WQ3(s)', supplier: 'Tuya', cost: 24.3, category: 'security' },
  { id: 'door-sensor', name: 'Smart Door Windows Sensor', model: 'DS1 00- W/ DS01', supplier: 'Tuya', cost: 4.60, category: 'security' },
  { id: 'motion-sensor', name: 'PIR Motion Sensor', model: 'MD100-W', supplier: 'Tuya', cost: 6.60, category: 'automation' },
  { id: 'hub', name: 'Super Remote Hub', model: 'S15-PRO', supplier: 'Tuya', cost: 15.10, category: 'automation' },
  { id: 'ac-controller', name: 'Air-Conditioner Controller', model: 'S16-PRO', supplier: 'Tuya', cost: 16.5, category: 'comfort' },
  { id: 'remote-control', name: 'Universal Remote Control', model: 'UFO-R1', supplier: 'Tuya', cost: 4.50, category: 'automation' },
  { id: 'power-strip', name: 'Smart Power Strip', model: 'WPS20-EU', supplier: '', cost: 21, category: 'energy' },
  { id: 'smart-plug', name: 'Smart Plug', model: 'F1S204-EU, F1S302-UK', supplier: 'Tuya', cost: 5.70, category: 'energy' },
  { id: 'pet-feeder', name: 'Pet Feeder + Pet Water Fountain', model: 'F17-C+W8', supplier: 'Tuya', cost: 16.60, category: 'pet' },
  { id: 'lock-box', name: 'Smart Lock Box', model: 'LL05- B', supplier: 'Tuya', cost: 24.60, category: 'security' }
];

const KIT_TEMPLATES: KitTemplate[] = [
  {
    id: 'studio',
    name: 'Studio Kit',
    description: 'Perfect for apartments, condos, small spaces',
    baseProducts: ['hub', 'smart-plug', 'smart-plug', 'smart-plug', 'motion-sensor', 'door-sensor'],
    targetPrice: { earlyBird: 119, standard: 159, retail: 199 }
  },
  {
    id: 'family',
    name: 'Family Kit',
    description: 'Ideal for families, townhomes, growing households',
    baseProducts: ['hub', 'doorbell-battery', 'smart-plug', 'smart-plug', 'smart-plug', 'smart-plug', 'motion-sensor', 'door-sensor', 'door-sensor', 'ac-controller'],
    targetPrice: { earlyBird: 239, standard: 319, retail: 399 }
  },
  {
    id: 'villa',
    name: 'Villa Kit',
    description: 'Comprehensive solution for large homes, luxury properties',
    baseProducts: ['hub', 'doorbell-2k', 'camera-battery', 'smart-plug', 'smart-plug', 'smart-plug', 'smart-plug', 'motion-sensor', 'motion-sensor', 'door-sensor', 'door-sensor', 'door-sensor', 'ac-controller', 'power-strip', 'lock-box', 'remote-control'],
    targetPrice: { earlyBird: 419, standard: 559, retail: 699 }
  }
];

export default function PricingCalculatorPage() {
  const [selectedKit, setSelectedKit] = useState<string>('studio');
  const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});
  const [inputs, setInputs] = useState<PricingInputs>({
    shippingFees: 0,
    platformFee: 5.0,
    paymentProcessingFee: 3.0,
    targetMarginLow: 35.0,
    targetMarginHigh: 45.0,
    targetDiscountLow: 25,
    targetDiscountHigh: 40,
    globalMarkupPercentage: 0,
    globalCAC: 50000,
    targetKitMargin: 40.0
  });

  const [priceSelection, setPriceSelection] = useState<PriceSelection>({
    vipPrice: 119,
    lowDiscountMSRP: 0,
    highDiscountMSRP: 0,
    yourMSRP: 199,
    earlyBirdDiscountPercent: 40,
    standardDiscountPercent: 20,
    autoCalculateMSRP: false
  });



  // Helper function to calculate dynamic pricing for a kit
  const calculateKitDynamicPrice = (kitId: string) => {
    const kit = KIT_TEMPLATES.find(k => k.id === kitId);
    if (!kit) return { earlyBird: 0, retail: 0 };
    
    // Calculate COGS for this kit
    const kitCOGS = kit.baseProducts.reduce((total, productId) => {
      const product = PRODUCTS.find(p => p.id === productId);
      return total + (product ? product.cost : 0);
    }, 0);

    // Apply global markup
    const markupMultiplier = 1 + (inputs.globalMarkupPercentage / 100);
    const adjustedCOGS = kitCOGS * markupMultiplier;

    // Calculate dynamic price based on COGS and target margin
    const targetMarginDecimal = inputs.targetKitMargin / 100;
    const earlyBirdPrice = adjustedCOGS / (1 - targetMarginDecimal);
    
    // Calculate retail price with standard discount (typically 20% higher)
    const retailPrice = earlyBirdPrice / (1 - 0.20);
    
    return {
      earlyBird: Math.round(earlyBirdPrice * 100) / 100,
      retail: Math.round(retailPrice * 100) / 100
    };
  };

  // Initialize selected products based on kit template
  const initializeKit = (kitId: string) => {
    const kit = KIT_TEMPLATES.find(k => k.id === kitId);
    if (!kit) return;
    
    const productCounts: Record<string, number> = {};
    kit.baseProducts.forEach(productId => {
      productCounts[productId] = (productCounts[productId] || 0) + 1;
    });
    
    setSelectedProducts(productCounts);
    
    // Use dynamic pricing instead of static values
    const dynamicPrices = calculateKitDynamicPrice(kitId);
    setPriceSelection({
      vipPrice: dynamicPrices.earlyBird,
      lowDiscountMSRP: 0,
      highDiscountMSRP: 0,
      yourMSRP: dynamicPrices.retail,
      earlyBirdDiscountPercent: 40,
      standardDiscountPercent: 20,
      autoCalculateMSRP: false
    });
  };

  // Initialize with studio kit on first load
  useState(() => {
    initializeKit('studio');
  });

  // Update Price Selection when global inputs change
  useEffect(() => {
    if (selectedKit) {
      const dynamicPrices = calculateKitDynamicPrice(selectedKit);
      setPriceSelection(prev => ({
        ...prev,
        vipPrice: dynamicPrices.earlyBird,
        yourMSRP: dynamicPrices.retail
      }));
    }
  }, [inputs.globalMarkupPercentage, inputs.targetKitMargin, selectedKit]);

  const currentKit = KIT_TEMPLATES.find(k => k.id === selectedKit);
  
  // Calculate total COGS from selected products with global markup
  const totalCOGS = useMemo(() => {
    const baseCOGS = Object.entries(selectedProducts).reduce((total, [productId, quantity]) => {
      const product = PRODUCTS.find(p => p.id === productId);
      return total + (product ? product.cost * quantity : 0);
    }, 0);
    
    // Apply global markup percentage
    const markupMultiplier = 1 + (inputs.globalMarkupPercentage / 100);
    return baseCOGS * markupMultiplier;
  }, [selectedProducts, inputs.globalMarkupPercentage]);

  const updateProductQuantity = (productId: string, change: number) => {
    setSelectedProducts(prev => {
      const newQuantity = Math.max(0, (prev[productId] || 0) + change);
      if (newQuantity === 0) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQuantity };
    });
  };

  const calculateResults = (): CalculationResults => {
    // Calculate dynamic MSRP if auto-calculate is enabled
    let calculatedMSRP = priceSelection.yourMSRP;
    if (priceSelection.autoCalculateMSRP) {
      // Use early bird discount percentage to calculate MSRP from VIP price
      calculatedMSRP = priceSelection.vipPrice / (1 - priceSelection.earlyBirdDiscountPercent / 100);
    }

    const revenue = {
      price: priceSelection.vipPrice,
      shipping: inputs.shippingFees,
      totalRevenue: priceSelection.vipPrice + inputs.shippingFees
    };

    const costs = {
      cogs: totalCOGS,
      shipping: inputs.shippingFees,
      platformFee: revenue.totalRevenue * (inputs.platformFee / 100),
      paymentFee: revenue.totalRevenue * (inputs.paymentProcessingFee / 100),
      totalCosts: 0
    };
    costs.totalCosts = costs.cogs + costs.shipping + costs.platformFee + costs.paymentFee;

    const profit = {
      totalProfit: revenue.totalRevenue - costs.totalCosts,
      profitMargin: revenue.totalRevenue > 0 ? ((revenue.totalRevenue - costs.totalCosts) / revenue.totalRevenue) * 100 : 0
    };

    const finalPrices = {
      finalMSRP: calculatedMSRP,
      finalVIPPrice: priceSelection.vipPrice,
      finalDollarDiscount: calculatedMSRP - priceSelection.vipPrice,
      finalPercentDiscount: calculatedMSRP > 0 ? ((calculatedMSRP - priceSelection.vipPrice) / calculatedMSRP) * 100 : 0,
      finalProfit: profit.totalProfit,
      finalMargin: profit.profitMargin
    };

    return {
      finalPrices,
      revenue,
      costs,
      profit
    };
  };

  const results = calculateResults();

  const updateInput = (field: keyof PricingInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const updatePriceSelection = (field: keyof PriceSelection, value: number | boolean) => {
    setPriceSelection(prev => ({ ...prev, [field]: value }));
  };





  // Calculate forecast results for each kit




  // Memoized dynamic kit prices to ensure proper re-rendering
  const dynamicKitPrices = useMemo(() => {
    const prices: Record<string, { earlyBird: number; retail: number }> = {};
    
    KIT_TEMPLATES.forEach(kit => {
      // Calculate COGS for this kit
      let kitCOGS = 0;
      kit.baseProducts.forEach(productId => {
        const product = PRODUCTS.find(p => p.id === productId);
        if (product) {
          kitCOGS += product.cost;
        }
      });

      // Apply global markup
      const adjustedCOGS = kitCOGS * (1 + inputs.globalMarkupPercentage / 100);
      
      // Calculate price based on target margin
      const earlyBirdPrice = adjustedCOGS / (1 - inputs.targetKitMargin / 100);
      const retailPrice = earlyBirdPrice * 1.67; // Assuming retail is ~67% higher than early bird
      
      prices[kit.id] = {
        earlyBird: Math.round(earlyBirdPrice),
        retail: Math.round(retailPrice)
      };
    });
    
    return prices;
  }, [inputs.globalMarkupPercentage, inputs.targetKitMargin]);

  // Helper function to get dynamic kit price
  const getDynamicKitPrice = (kitId: string) => {
    return dynamicKitPrices[kitId] || { earlyBird: 0, retail: 0 };
  };

  // Validation system for comprehensive kit pricing
  const validatePricingInputs = useMemo(() => {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Check margin consistency
    if (inputs.targetMarginLow > inputs.targetMarginHigh) {
      warnings.push('Target Margin Low should be less than Target Margin High');
    }

    // Check discount consistency
    if (inputs.targetDiscountLow > inputs.targetDiscountHigh) {
      warnings.push('Target Discount Low should be less than Target Discount High');
    }

    // Check if margins and discounts are realistic
    if (inputs.targetKitMargin < 10) {
      warnings.push('Target Kit Margin below 10% may not be sustainable');
    }

    if (inputs.targetKitMargin > 80) {
      warnings.push('Target Kit Margin above 80% may be too aggressive');
    }

    // Check platform fees
    if (inputs.platformFee + inputs.paymentProcessingFee > 15) {
      warnings.push('Combined platform and payment fees exceed 15%');
    }

    // Check global markup
    if (inputs.globalMarkupPercentage > 200) {
      warnings.push('Global markup above 200% may be excessive');
    }

    // Check shipping fees
    if (inputs.shippingFees > 50) {
      warnings.push('Shipping fees above $50 may impact conversion rates');
    }

    // Check VIP price vs calculated price alignment
    if (selectedKit && priceSelection.vipPrice > 0) {
      const kit = KIT_TEMPLATES.find(k => k.id === selectedKit);
      if (kit) {
        const calculatedPrice = getDynamicKitPrice(kit.id).earlyBird;
        const priceDifference = Math.abs(priceSelection.vipPrice - calculatedPrice);
        const percentageDiff = (priceDifference / calculatedPrice) * 100;
        
        if (percentageDiff > 20) {
          warnings.push(`VIP price differs by ${percentageDiff.toFixed(1)}% from calculated price`);
        }
      }
    }

    return { warnings, errors, isValid: errors.length === 0 };
  }, [inputs, priceSelection, selectedKit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">VIP Pricing Calculator</h1>
              <p className="text-white/70">Determine optimal VIP and MSRP pricing for your crowdfunding campaign</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors">
              <Save className="w-4 h-4" />
              Save Scenario
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors">
              <Upload className="w-4 h-4" />
              Load Scenario
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors">
              <Download className="w-4 h-4" />
              Export Results
            </button>
          </div>

          {/* Validation Alerts */}
          {(validatePricingInputs.warnings.length > 0 || validatePricingInputs.errors.length > 0) && (
            <div className="mt-4 space-y-2">
              {validatePricingInputs.errors.map((error, index) => (
                <div key={`error-${index}`} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm">{error}</span>
                </div>
              ))}
              {validatePricingInputs.warnings.map((warning, index) => (
                <div key={`warning-${index}`} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-200">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">{warning}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kit Selection */}
        <div className="mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Kit Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {KIT_TEMPLATES.map((kit) => (
                <button
                  key={kit.id}
                  onClick={() => {
                    setSelectedKit(kit.id);
                    initializeKit(kit.id);
                  }}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedKit === kit.id
                      ? 'bg-purple-500/30 border-purple-400 text-white'
                      : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5" />
                    <h3 className="font-semibold">{kit.name}</h3>
                  </div>
                  <p className="text-sm opacity-80 mb-2">{kit.description}</p>
                  <div className="text-xs">
                    <div>Early Bird: ${getDynamicKitPrice(kit.id).earlyBird}</div>
                    <div>Retail: ${getDynamicKitPrice(kit.id).retail}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Four Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Column 1: Product Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Product Selection</h2>
            
            <div className="space-y-4">
              <div className="mb-4">
                <div className="text-sm text-white/80 mb-2">Total COGS: <span className="font-mono text-white">${totalCOGS.toFixed(2)}</span></div>
                <div className="text-sm text-white/80">Products: {Object.values(selectedProducts).reduce((a, b) => a + b, 0)} items</div>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-3">
                {PRODUCTS.map((product) => {
                  const quantity = selectedProducts[product.id] || 0;
                  const categoryColors = {
                    security: 'bg-red-500/20 text-red-300',
                    automation: 'bg-blue-500/20 text-blue-300',
                    energy: 'bg-green-500/20 text-green-300',
                    comfort: 'bg-purple-500/20 text-purple-300',
                    pet: 'bg-orange-500/20 text-orange-300'
                  };
                  
                  return (
                    <div key={product.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{product.name}</div>
                          <div className="text-xs text-white/60">{product.model} • ${product.cost}</div>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${categoryColors[product.category]}`}>
                            {product.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateProductQuantity(product.id, -1)}
                            disabled={quantity === 0}
                            className="w-6 h-6 rounded bg-white/10 border border-white/20 text-white disabled:opacity-50 hover:bg-white/20 flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-white font-mono">{quantity}</span>
                          <button
                            onClick={() => updateProductQuantity(product.id, 1)}
                            className="w-6 h-6 rounded bg-white/10 border border-white/20 text-white hover:bg-white/20 flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {quantity > 0 && (
                        <div className="text-xs text-white/60">
                          Subtotal: ${(product.cost * quantity).toFixed(2)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Inputs */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Pricing Inputs</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Shipping & Fees</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter shipping cost per kit"
                    value={inputs.shippingFees || ''}
                    onChange={(e) => updateInput('shippingFees', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">$</span>
                </div>
                <div className="text-xs text-white/60 mt-1">Fixed shipping cost per kit (not percentage)</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Assumptions</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Platform Fee</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={inputs.platformFee}
                        onChange={(e) => updateInput('platformFee', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white/60 text-xs">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Payment Processing</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={inputs.paymentProcessingFee}
                        onChange={(e) => updateInput('paymentProcessingFee', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white/60 text-xs">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Target Margin (Low)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={inputs.targetMarginLow}
                        onChange={(e) => updateInput('targetMarginLow', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white/60 text-xs">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Target Margin (High)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={inputs.targetMarginHigh}
                        onChange={(e) => updateInput('targetMarginHigh', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white/60 text-xs">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Target Discount (Low)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={inputs.targetDiscountLow}
                        onChange={(e) => updateInput('targetDiscountLow', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white/60 text-xs">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Target Discount (High)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={inputs.targetDiscountHigh}
                        onChange={(e) => updateInput('targetDiscountHigh', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white/60 text-xs">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Global Markup</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Enter markup percentage"
                    value={inputs.globalMarkupPercentage || ''}
                    onChange={(e) => updateInput('globalMarkupPercentage', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">%</span>
                </div>
                <div className="text-xs text-white/60 mt-1">Applied to all product costs</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Global CAC</label>
                <div className="relative">
                  <input
                    type="number"
                    step="1000"
                    placeholder="Enter customer acquisition cost"
                    value={inputs.globalCAC || ''}
                    onChange={(e) => updateInput('globalCAC', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">$</span>
                </div>
                <div className="text-xs text-white/60 mt-1">Cost per kit - multiplied by total kit quantity</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Target Kit Margin</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="Enter target margin percentage"
                    value={inputs.targetKitMargin || ''}
                    onChange={(e) => updateInput('targetKitMargin', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">%</span>
                </div>
                <div className="text-xs text-white/60 mt-1">Margin percentage used to calculate dynamic kit pricing</div>
              </div>
            </div>
          </div>

          {/* Column 3: Price Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Price Selection</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">VIP Price</label>
                <div className="space-y-2">
                  <div className="text-xs text-white/60">Low Margin Threshold</div>
                  <div className="text-xs text-white/60">High Margin Threshold</div>
                  <div className="text-xs text-white/60">Your VIP Price</div>
                  <input
                    type="number"
                    placeholder="Enter VIP Price"
                    value={priceSelection.vipPrice || ''}
                    onChange={(e) => updatePriceSelection('vipPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">MSRP Configuration</label>
                
                {/* Auto-Calculate Toggle */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={priceSelection.autoCalculateMSRP}
                      onChange={(e) => updatePriceSelection('autoCalculateMSRP', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-white/80">Auto-calculate MSRP from discount %</span>
                  </label>
                </div>

                {/* Discount Percentages for Auto-Calculate */}
                {priceSelection.autoCalculateMSRP && (
                  <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="block text-xs text-white/60 mb-1">Early Bird Discount %</label>
                        <input
                          type="number"
                          step="0.1"
                          value={priceSelection.earlyBirdDiscountPercent}
                          onChange={(e) => updatePriceSelection('earlyBirdDiscountPercent', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1">Standard Discount %</label>
                        <input
                          type="number"
                          step="0.1"
                          value={priceSelection.standardDiscountPercent}
                          onChange={(e) => updatePriceSelection('standardDiscountPercent', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-white/60">MSRP = VIP Price ÷ (1 - Early Bird Discount %)</div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-xs text-white/60">Low Discount MSRP</div>
                  <input
                    type="number"
                    placeholder="Needs VIP Price"
                    value={priceSelection.lowDiscountMSRP || ''}
                    onChange={(e) => updatePriceSelection('lowDiscountMSRP', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  
                  <div className="text-xs text-white/60">High Discount MSRP</div>
                  <input
                    type="number"
                    placeholder="Needs VIP Price"
                    value={priceSelection.highDiscountMSRP || ''}
                    onChange={(e) => updatePriceSelection('highDiscountMSRP', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  
                  <div className="text-xs text-white/60">{priceSelection.autoCalculateMSRP ? 'Calculated MSRP' : 'Your MSRP'}</div>
                  <input
                    type="number"
                    placeholder={priceSelection.autoCalculateMSRP ? 'Auto-calculated' : 'Enter MSRP'}
                    value={priceSelection.autoCalculateMSRP ? (priceSelection.vipPrice / (1 - priceSelection.earlyBirdDiscountPercent / 100)).toFixed(2) : (priceSelection.yourMSRP || '')}
                    onChange={(e) => !priceSelection.autoCalculateMSRP && updatePriceSelection('yourMSRP', parseFloat(e.target.value) || 0)}
                    disabled={priceSelection.autoCalculateMSRP}
                    className={`w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 ${priceSelection.autoCalculateMSRP ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Final Breakdowns */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Final Breakdowns</h2>
            
            <div className="space-y-6">
              {/* Final Prices & Discounts */}
              <div>
                <h3 className="text-sm font-medium text-white/80 mb-3">Final Prices & Discounts</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Final MSRP</span>
                    <span className="text-white font-mono">${results.finalPrices.finalMSRP.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Final VIP Price</span>
                    <span className="text-white font-mono">${results.finalPrices.finalVIPPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Final Dollar Discount</span>
                    <span className="text-white font-mono">${results.finalPrices.finalDollarDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Final % Discount</span>
                    <span className="text-white font-mono">{results.finalPrices.finalPercentDiscount.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Final Profit</span>
                    <span className="text-white font-mono">${results.finalPrices.finalProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Final Margin (with shipping)</span>
                    <span className="text-white font-mono">{results.finalPrices.finalMargin.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Revenue Details */}
              <div>
                <h3 className="text-sm font-medium text-white/80 mb-3">Revenue Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Price</span>
                    <span className="text-white font-mono">${results.revenue.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Shipping</span>
                    <span className="text-white font-mono">${results.revenue.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-2">
                    <span className="text-white/70 font-medium">Total Revenue</span>
                    <span className="text-white font-mono font-medium">${results.revenue.totalRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Cost Details */}
              <div>
                <h3 className="text-sm font-medium text-white/80 mb-3">Cost Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">COGS</span>
                    <span className="text-white font-mono">${results.costs.cogs.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Shipping</span>
                    <span className="text-white font-mono">${results.costs.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Platform Fee</span>
                    <span className="text-white font-mono">${results.costs.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Payment Fee</span>
                    <span className="text-white font-mono">${results.costs.paymentFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-2">
                    <span className="text-white/70 font-medium">Total Costs</span>
                    <span className="text-white font-mono font-medium">${results.costs.totalCosts.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Profit Details */}
              <div>
                <h3 className="text-sm font-medium text-white/80 mb-3">Profit Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Profit</span>
                    <span className="text-white font-mono">${results.profit.totalProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Profit Margin</span>
                    <span className="text-white font-mono">{results.profit.profitMargin.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Section */}

      </div>
    </div>
  );
}
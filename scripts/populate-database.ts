import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { storeData } from '../modules/store/data/store-sections';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

async function populateDatabase() {
  console.log('Starting database population...');
  
  try {
    // Clear existing data 
    if (process.env.CLEAR_EXISTING_DATA === 'true') {
      console.log('Clearing existing data...');
      await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('models').delete().neq('id', 0);
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('sections').delete().neq('id', '');
      await supabase.rpc('reset_models_id_sequence');
    }

    // Process each section
    for (const section of storeData) {
      console.log(`Processing section: ${section.id} - ${section.name}`);
      
      // Insert section into Supabase
      const { data: sectionData, error: sectionError } = await supabase
        .from('sections')
        .upsert({
          id: section.id,
          name: section.name
        })
        .select()
        .single();
        
      if (sectionError) {
        console.error(`Error adding section ${section.id}:`, sectionError);
        continue;
      }
      
      console.log(`Added section: ${sectionData.id}`);
      
      // Insert section model
      const { error: modelError } = await supabase
        .from('models')
        .upsert({
          section_id: section.id,
          product_id: null,
          path: section.model.path,
          position: JSON.stringify(section.model.position),
          rotation: section.model.rotation ? JSON.stringify(section.model.rotation) : null,
          scale: section.model.scale ? 
            (typeof section.model.scale === 'number' ? 
              section.model.scale : 
              JSON.stringify(section.model.scale)) : 
            null,
          label: section.model.label || null
        });
        
      if (modelError) {
        console.error(`Error adding model for section ${section.id}:`, modelError);
      }
      
      for (const product of section.products) {
        console.log(`  Processing product: ${product.name}`);
        
        const modelPath = `products/${section.id}/${product.modelId}`;
        const thumbnailPath = `${section.id}/${product.modelId}.webp`;
        
        // Create Stripe product and price if stripe is initialized
        let stripeProductId = null;
        let stripePriceId = null;
        
        if (stripe) {
          try {
            const stripeProduct = await stripe.products.create({
              name: product.name,
              description: product.description,
              metadata: {
                section_id: section.id
              },
              images: [`${process.env.VITE_PUBLIC_URL}/thumbnails/${thumbnailPath}`]
            });
            stripeProductId = stripeProduct.id;
            
            // Create price for the product
            const stripePrice = await stripe.prices.create({
              product: stripeProductId,
              unit_amount: Math.round(product.price * 100), // Convert to cents
              currency: 'usd'
            });
            stripePriceId = stripePrice.id;
            
            console.log(`  Created Stripe product and price for ${product.name}`);
          } catch (stripeError) {
            console.error(`  Error creating Stripe product/price for ${product.name}:`, stripeError);
          }
        }
        
        // Insert product into Supabase
        const { data: productData, error: productError } = await supabase
          .from('products')
          .upsert({
            section_id: section.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock || Math.floor(Math.random() * 50) + 1,
            stripe_product_id: stripeProductId,
            stripe_price_id: stripePriceId,
            thumbnail_path: thumbnailPath
          })
          .select()
          .single();
          
        if (productError) {
          console.error(`  Error adding product ${product.name}:`, productError);
          continue;
        }
        
        console.log(`  Added product: ${productData.id} - ${productData.name}`);
        
        // Insert product model
        const { error: productModelError } = await supabase
          .from('models')
          .upsert({
            section_id: null,
            product_id: productData.id,
            path: modelPath,
            position: JSON.stringify(product.modelPosition),
            rotation: product.modelRotation ? JSON.stringify(product.modelRotation) : null,
            scale: product.modelScale ? 
              (typeof product.modelScale === 'number' ? 
                product.modelScale : 
                JSON.stringify(product.modelScale)) : 
              null,
            label: null
          });
          
        if (productModelError) {
          console.error(`  Error adding model for product ${product.name}:`, productModelError);
        }
      }
    }
    
    console.log('Database population complete!');
  } catch (error) {
    console.error('An error occurred during database population:', error);
  }
}

populateDatabase();

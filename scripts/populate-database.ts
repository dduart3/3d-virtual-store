import { createClient } from '@supabase/supabase-js';
import { storeData } from '../src/modules/experience/store/data/store-sections';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function populateDatabase() {
  console.log('Starting database population...');

  try {
    // Clear existing data
    if (process.env.CLEAR_EXISTING_DATA === 'true') {
      console.log('Clearing existing data...');
      await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('models').delete().neq('id', 0);
      await supabase.from('products').delete().neq('id', '');
      await supabase.from('sections').delete().neq('id', '');
      await supabase.rpc('reset_models_id_sequence');
      
      // Clear storage buckets if needed
      console.log('Clearing storage buckets...');
      const { data: storageObjects } = await supabase.storage.from('store').list();
      if (storageObjects && storageObjects.length > 0) {
        for (const folder of storageObjects) {
          await supabase.storage.from('store').remove([`${folder.name}`]);
        }
      }
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
      
      // Upload section model to storage
      const sectionModelPath = path.join(process.cwd(), 'public', 'models', 'displays', `${section.id}.glb`);
      if (fs.existsSync(sectionModelPath)) {
        const modelFile = fs.readFileSync(sectionModelPath);
        const { error: uploadError } = await supabase.storage
          .from('store')
          .upload(`sections/${section.id}/model.glb`, modelFile, {
            contentType: 'model/gltf-binary',
            upsert: true
          });
          
        if (uploadError) {
          console.error(`Error uploading section model for ${section.id}:`, uploadError);
        } else {
          console.log(`Uploaded section model: sections/${section.id}/model.glb`);
        }
      } else {
        console.warn(`Section model file not found: ${sectionModelPath}`);
      }
      
      // Insert section model
      const { error: modelError } = await supabase
        .from('models')
        .upsert({
          section_id: section.id,
          product_id: null,
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
        
        // Use just the product ID (not combined with section)
        const productId = product.id;
        
        // Insert product into Supabase with product ID
        const { data: productData, error: productError } = await supabase
          .from('products')
          .upsert({
            id: productId,
            section_id: section.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock || Math.floor(Math.random() * 50) + 1
          })
          .select()
          .single();
        
        if (productError) {
          console.error(`  Error adding product ${product.name}:`, productError);
          continue;
        }
        
        console.log(`  Added product: ${productData.id} - ${productData.name}`);
        
        // Upload product thumbnail to storage
        const thumbnailPath = path.join(process.cwd(), 'public', 'thumbnails', section.id, `${product.modelId}.webp`);
        if (fs.existsSync(thumbnailPath)) {
          const thumbnailFile = fs.readFileSync(thumbnailPath);
          const { error: uploadError } = await supabase.storage
            .from('store')
            .upload(`products/${productId}/thumbnail.webp`, thumbnailFile, {
              contentType: 'image/webp',
              upsert: true
            });
            
          if (uploadError) {
            console.error(`  Error uploading thumbnail for ${product.name}:`, uploadError);
          } else {
            console.log(`  Uploaded thumbnail: products/${productId}/thumbnail.webp`);
          }
        } else {
          console.warn(`  Thumbnail file not found: ${thumbnailPath}`);
        }
        
        // Upload product model to storage
        const productModelPath = path.join(process.cwd(), 'public', 'models', 'products', section.id, `${product.modelId}.glb`);
        if (fs.existsSync(productModelPath)) {
          const modelFile = fs.readFileSync(productModelPath);
          const { error: uploadError } = await supabase.storage
            .from('store')
            .upload(`products/${productId}/model.glb`, modelFile, {
              contentType: 'model/gltf-binary',
              upsert: true
            });
            
          if (uploadError) {
            console.error(`  Error uploading model for ${product.name}:`, uploadError);
          } else {
            console.log(`  Uploaded model: products/${productId}/model.glb`);
          }
        } else {
          console.warn(`  Product model file not found: ${productModelPath}`);
        }
        
        // Insert product model
        const { error: productModelError } = await supabase
          .from('models')
          .upsert({
            section_id: null,
            product_id: productData.id,
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

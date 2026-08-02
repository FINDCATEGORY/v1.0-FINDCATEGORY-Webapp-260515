'use client';

import { PlusIcon } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useCart } from './cart-context';
import { Product, ProductVariant } from '@/lib/shopify/types';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  className
}: {
  availableForSale: boolean;
  selectedVariantId?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  if (!availableForSale) {
    return (
      <Button disabled className={className}>
        Out Of Stock
      </Button>
    );
  }

  if (!selectedVariantId) {
    return (
      <Button aria-disabled disabled className={className}>
        Select Option
      </Button>
    );
  }

  return (
    <Button
      aria-label="Add to cart"
      disabled={pending}
      className={className}
    >
      {pending ? (
        <span>Adding...</span>
      ) : (
        <>
          <PlusIcon className="w-4 h-4 mr-2" />
          <span>Add To Cart</span>
        </>
      )}
    </Button>
  );
}

export function AddToCartButton({
  product,
  selectedVariantId,
  availableForSale = true,
  className
}: {
  product?: Product;
  selectedVariantId?: string;
  availableForSale?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    if (!product) return;
    const variant = product.variants?.find((v: ProductVariant) => v.id === selectedVariantId) || product.variants?.[0];
    if (variant) {
      await addItem(variant, product);
    }
  };

  return (
    <form action={handleAddToCart}>
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId || product?.variants?.[0]?.id}
        className={className}
      />
    </form>
  );
}

export function AddToCart({
  product,
  variants,
  availableForSale = true,
  className
}: {
  product?: Product;
  variants?: ProductVariant[];
  availableForSale?: boolean;
  className?: string;
}) {
  const defaultVariantId = variants?.length === 1 ? variants[0]?.id : undefined;

  return (
    <AddToCartButton
      product={product}
      selectedVariantId={defaultVariantId}
      availableForSale={availableForSale}
      className={className}
    />
  );
}

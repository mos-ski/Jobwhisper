import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { PRODUCTS } from '../product-content'
import { ProductPage } from './product-page'

vi.stubGlobal(
  'IntersectionObserver',
  class {
    observe() {}
    disconnect() {}
  },
)
vi.stubGlobal('scrollTo', vi.fn())

describe('ProductPage', () => {
  for (const product of Object.values(PRODUCTS)) {
    it(`renders the ${product.label} outcome story`, () => {
      render(
        <MemoryRouter>
          <ProductPage slug={product.slug} />
        </MemoryRouter>,
      )

      expect(screen.getByRole('heading', { level: 1, name: product.headline })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument()
      for (const section of product.sections) {
        expect(screen.getByRole('heading', { name: section.title })).toBeInTheDocument()
      }
    })
  }
})

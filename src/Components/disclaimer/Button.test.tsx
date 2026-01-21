import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../ui/button'

describe('Componente Button', () => {
  it('debe ejecutar la función onClick al hacer clic', () => {
    const handleClick = jest.fn() // Creamos una función simulada (mock)
    
    render(<Button onClick={handleClick}>Enviar</Button>)
    
    const button = screen.getByRole('button', { name: /enviar/i })
    fireEvent.click(button)
    
    // Verificamos que la función se llamó exactamente 1 vez
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
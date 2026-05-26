"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface ProductCardProps {
  id: number
  name: string
  image: string
  onClick: () => void
  isFaded?: boolean
}

export function ProductCard({ id, name, image, onClick, isFaded }: ProductCardProps) {
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    const scheduleNextShake = () => {
      const randomDelay = Math.random() * 1000 + 4500 // Random between 4.5-5.5 seconds

      return setTimeout(() => {
        setIsShaking(true)
        setTimeout(() => {
          setIsShaking(false)
          scheduleNextShake()
        }, 500)
      }, randomDelay)
    }

    const timeout = scheduleNextShake()

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div
      className={`group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 ${
        isShaking ? "animate-shake" : ""
      } ${isFaded ? "opacity-20" : "opacity-100"}`}
      onClick={onClick}
    >
      <div className="relative mb-2 aspect-square overflow-hidden rounded-sm bg-white">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  )
}

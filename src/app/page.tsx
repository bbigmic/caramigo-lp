'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Background from '@/components/Background'
import Image from 'next/image'
import { FaAndroid } from 'react-icons/fa'

export default function Home() {
  const [phone, setPhone] = useState('')
  const [prefix, setPrefix] = useState('48')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [consent, setConsent] = useState(false)

  // Formatowanie numeru telefonu w zależności od kraju
  const formatPhoneNumber = (value: string, countryCode: string) => {
    // Usuń wszystkie znaki niebędące cyframi
    const numbers = value.replace(/\D/g, '')
    
    switch (countryCode) {
      case '48': // Polska
        return numbers.slice(0, 9)
      case '49': // Niemcy
        return numbers.slice(0, 11)
      case '44': // UK
        return numbers.slice(0, 10)
      case '33': // Francja
        return numbers.slice(0, 9)
      case '39': // Włochy
        return numbers.slice(0, 10)
      case '34': // Hiszpania
        return numbers.slice(0, 9)
      case '31': // Holandia
        return numbers.slice(0, 9)
      case '32': // Belgia
        return numbers.slice(0, 9)
      case '43': // Austria
        return numbers.slice(0, 10)
      case '41': // Szwajcaria
        return numbers.slice(0, 9)
      case '46': // Szwecja
        return numbers.slice(0, 9)
      case '45': // Dania
        return numbers.slice(0, 8)
      case '47': // Norwegia
        return numbers.slice(0, 8)
      case '358': // Finlandia
        return numbers.slice(0, 9)
      case '36': // Węgry
        return numbers.slice(0, 9)
      case '420': // Czechy
        return numbers.slice(0, 9)
      case '421': // Słowacja
        return numbers.slice(0, 9)
      case '40': // Rumunia
        return numbers.slice(0, 10)
      case '359': // Bułgaria
        return numbers.slice(0, 9)
      case '385': // Chorwacja
        return numbers.slice(0, 9)
      case '386': // Słowenia
        return numbers.slice(0, 8)
      case '30': // Grecja
        return numbers.slice(0, 10)
      case '351': // Portugalia
        return numbers.slice(0, 9)
      case '353': // Irlandia
        return numbers.slice(0, 9)
      default:
        return numbers.slice(0, 15) // Domyślny limit
    }
  }

  // Walidacja numeru telefonu
  const isValidPhoneNumber = (value: string, countryCode: string) => {
    const numbers = value.replace(/\D/g, '')
    
    switch (countryCode) {
      case '48': // Polska
        return numbers.length === 9
      case '49': // Niemcy
        return numbers.length >= 10 && numbers.length <= 11
      case '44': // UK
        return numbers.length === 10
      case '33': // Francja
        return numbers.length === 9
      case '39': // Włochy
        return numbers.length === 10
      case '34': // Hiszpania
        return numbers.length === 9
      case '31': // Holandia
        return numbers.length === 9
      case '32': // Belgia
        return numbers.length === 9
      case '43': // Austria
        return numbers.length === 10
      case '41': // Szwajcaria
        return numbers.length === 9
      case '46': // Szwecja
        return numbers.length === 9
      case '45': // Dania
        return numbers.length === 8
      case '47': // Norwegia
        return numbers.length === 8
      case '358': // Finlandia
        return numbers.length === 9
      case '36': // Węgry
        return numbers.length === 9
      case '420': // Czechy
        return numbers.length === 9
      case '421': // Słowacja
        return numbers.length === 9
      case '40': // Rumunia
        return numbers.length === 10
      case '359': // Bułgaria
        return numbers.length === 9
      case '385': // Chorwacja
        return numbers.length === 9
      case '386': // Słowenia
        return numbers.length === 8
      case '30': // Grecja
        return numbers.length === 10
      case '351': // Portugalia
        return numbers.length === 9
      case '353': // Irlandia
        return numbers.length === 9
      default:
        return numbers.length >= 8 && numbers.length <= 15
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!isValidPhoneNumber(phone, prefix)) {
      setError('Nieprawidłowy numer telefonu dla wybranego kraju')
      return
    }

    setIsLoading(true)
    
    try {
      await fetch('https://script.google.com/macros/s/AKfycbw80W4l6kIyL-dZ7OJPJpIK3mQylKLGfkFWaVMrgWcgAyzrXNFZGLnf-HNuAf7V5cRr/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({ 
          prefix: prefix,
          phone: phone,
          consent: consent
        }),
      })

      setSubmitted(true)
    } catch (err) {
      setError('Przepraszamy, wystąpił błąd. Spróbuj ponownie później.')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value, prefix)
    setPhone(formattedNumber)
  }

  const handlePrefixChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrefix(e.target.value)
    // Przeformatuj numer przy zmianie kierunkowego
    setPhone(formatPhoneNumber(phone, e.target.value))
  }

  return (
    <main className="min-h-screen">
      <Background />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 pb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-8"
          >
            Caramigo
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <Image
              src="/car-amigo-logo.png"
              alt="Caramigo Logo"
              width={200}
              height={200}
              className="mx-auto"
            />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-12 text-gray-300"
          >
            Połączenie warsztatów z lawetami w jednej aplikacji
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4">Dla Warsztatów</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Szybkie znalezienie lawety</li>
                  <li>• Transparentne ceny</li>
                  <li>• Historia współpracy</li>
                  <li>• Oszczędność czasu</li>
                </ul>
              </div>
              
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4">Dla Przewoźników</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Nowe zlecenia</li>
                  <li>• Elastyczny grafik</li>
                  <li>• Bezpieczne płatności</li>
                  <li>• Budowanie reputacji</li>
                </ul>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-12 space-y-4"
            >
              <a
                href="https://expo.dev/artifacts/eas/fp1SrtwNz2LAqZPW5GuRL7.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-[#3DDC84] hover:bg-[#2BB673] rounded-lg font-semibold transition-colors text-black flex items-center justify-center gap-2"
              >
                <FaAndroid className="text-xl" />
                Pobierz na Androida
              </a>
              <p className="text-gray-400 text-sm">
                Wkrótce również na iOS
              </p>
            </motion.div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <select
                    value={prefix}
                    onChange={handlePrefixChange}
                    className="w-32 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
                  >
                    <option value="48">🇵🇱 Polska (+48)</option>
                    <option value="49">🇩🇪 Niemcy (+49)</option>
                    <option value="44">🇬🇧 Wielka Brytania (+44)</option>
                    <option value="33">🇫🇷 Francja (+33)</option>
                    <option value="39">🇮🇹 Włochy (+39)</option>
                    <option value="34">🇪🇸 Hiszpania (+34)</option>
                    <option value="31">🇳🇱 Holandia (+31)</option>
                    <option value="32">🇧🇪 Belgia (+32)</option>
                    <option value="43">🇦🇹 Austria (+43)</option>
                    <option value="41">🇨🇭 Szwajcaria (+41)</option>
                    <option value="46">🇸🇪 Szwecja (+46)</option>
                    <option value="45">🇩🇰 Dania (+45)</option>
                    <option value="47">🇳🇴 Norwegia (+47)</option>
                    <option value="358">🇫🇮 Finlandia (+358)</option>
                    <option value="36">🇭🇺 Węgry (+36)</option>
                    <option value="420">🇨🇿 Czechy (+420)</option>
                    <option value="421">🇸🇰 Słowacja (+421)</option>
                    <option value="40">🇷🇴 Rumunia (+40)</option>
                    <option value="359">🇧🇬 Bułgaria (+359)</option>
                    <option value="385">🇭🇷 Chorwacja (+385)</option>
                    <option value="386">🇸🇮 Słowenia (+386)</option>
                    <option value="30">🇬🇷 Grecja (+30)</option>
                    <option value="351">🇵🇹 Portugalia (+351)</option>
                    <option value="353">🇮🇪 Irlandia (+353)</option>
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Twój numer telefonu"
                    required
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                <div className="flex items-start gap-2 text-sm text-gray-300 text-left !important">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    className="mt-1"
                  />
                  <label htmlFor="consent" className="text-left !important">
                    Wyrażam zgodę na poinformowanie mnie o premierze pełnej wersji aplikacji na podany numer telefonu. Administratorem danych jest Caramigo.
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors relative ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Zapisywanie...
                    </div>
                  ) : (
                    'Zapisz się na premierę'
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl text-green-400"
              >
                Dziękujemy! Skontaktujemy się z Tobą wkrótce.
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}

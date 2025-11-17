import { useState } from 'react'
import NavBar from './NavBar'

export const DonationBanner = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    isOpen && (
      <>
        <NavBar color="bg-blue-500" className="relative pt-1 z-[99999999]" />
        <div
          class="bg-[#1B1E21] text-[#C3FAE8] relative flex items-end"
          style={{
            backgroundImage:
              "url('/static/images/donate_banner/donate_banner_bg.svg')",
            backgroundPosition: '33% center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <button
            class="absolute top-4 right-6 text-[#C3FAE8] hover:text-white transition-colors cursor-pointer bg-transparent border-none text-4xl"
            aria-label="Close donation banner"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
          <div class="max-w-[990px] px-8 mx-auto">
            <div class="flex md:flex-row flex-col-reverse">
              <div class="md:w-[52%] w-full flex items-end">
                <img
                  src="/static/images/donate_banner/tentacle.svg"
                  alt="Tentacle"
                />
              </div>
              <div class="md:w-[48%] md:ml-[-20px] w-full py-8 flex flex-col">
                <div>
                  <img
                    src="/static/images/donate_banner/slogan.svg"
                    alt="Protect Our Internet; Document Censorship"
                    class="md:ml-[-40px] md:w-[90%] mb-8 md:mb-4"
                  />
                </div>
                <div class="md:w-10/12">
                  <p class="mb-2">
                    Around the world, access to online information is
                    increasingly blocked.
                  </p>
                  <p class="mb-2">
                    Transparency of internet censorship is more important than
                    ever.
                  </p>
                  <p class="mb-2">
                    <b>
                      Support the world's largest open dataset on internet
                      censorship.
                    </b>{' '}
                    Donate to OONI and help keep the internet open.
                  </p>
                  <a
                    href="https://ooni.org/donate/"
                    class="block mx-auto mt-8 w-fit"
                  >
                    <button
                      class="bg-[#15FFAB] text-black rounded-sm px-4 py-2 hover:cursor-pointer"
                      type="button"
                    >
                      Donate now
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  )
}

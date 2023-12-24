'use client';

import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { OrganizationSwitcher, useAuth } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton
} from '@clerk/nextjs';

const navigation = [
  { name: 'Data Generation', href: '/' },
  { name: 'LLM Hub', href: '/llmhub' },
  { name: 'Chat Simulator', href: '/simulate' },
  { name: 'Evaluation', href: '/evaluation' },
  { name: 'CICD', href: '/cicd' },
  { name: 'Settings', href: '/settings' }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const pathname = usePathname();
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <Disclosure as="nav" className="bg-gray-50 shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                <svg width="64px" height="64px" viewBox="-389.12 -389.12 1802.24 1802.24" 
                  className="icon" 
                  version="1.1" 
                  xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" strokeWidth="0.01024"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="4.096"></g><g id="SVGRepo_iconCarrier"><path d="M304 592h416l104 296h-624L304 592z m328 128c12.8 0 24-11.2 24-24s-11.2-24-24-24-24 11.2-24 24 11.2 24 24 24z m-256-48c12.8 0 24-11.2 24-24s-11.2-24-24-24-24 11.2-24 24 11.2 24 24 24z m136 112c9.6 0 16-6.4 16-16s-6.4-16-16-16-16 6.4-16 16 6.4 16 16 16z m8-256c-12.8 0-24-11.2-24-24s11.2-24 24-24 24 11.2 24 24-11.2 24-24 24z m104 48c-9.6 0-16-6.4-16-16s6.4-16 16-16 16 6.4 16 16-6.4 16-16 16z" fill="#1e1721"></path><path d="M622.4 112H401.6c9.6 76.8 14.4 142.4 14.4 176 0 35.2-65.6 248-200 592h593.6C673.6 536 608 323.2 608 288c0-33.6 4.8-99.2 14.4-176z m32 0c-9.6 78.4-14.4 144-14.4 176 0 28.8 67.2 248 198.4 580.8 1.6 3.2 1.6 8 1.6 11.2 0 17.6-14.4 32-32 32H214.4c-4.8 0-8 0-11.2-1.6-16-6.4-24-25.6-17.6-41.6C316.8 536 384 316.8 384 288c0-32-4.8-97.6-14.4-176H368c-9.6 0-16-6.4-16-16s6.4-16 16-16h288c9.6 0 16 6.4 16 16s-6.4 16-17.6 16c1.6 0 0 0 0 0z" fill="#2c2d35"></path><path d="M424 480h48c4.8 0 8 3.2 8 8s-3.2 8-8 8H432v48h24c4.8 0 8 3.2 8 8s-3.2 8-8 8H432v48h40c4.8 0 8 3.2 8 8s-3.2 8-8 8H432v48h24c4.8 0 8 3.2 8 8s-3.2 8-8 8H432v48h40c4.8 0 8 3.2 8 8s-3.2 8-8 8H416V480h8z" fill="#2c2d35"></path></g>
                </svg>  
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {userId ? (
                    navigation.map((item: any) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? 'border-slate-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                        )}
                        aria-current={
                          pathname === item.href ? 'page' : undefined
                        }
                      >
                        {item.name}
                      </a>
                    ))
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>

                      <span className="text-xs text-gray-700 whitespace-nowrap"></span>
                      <div className="h-8 w-8 rounded-full text-white text-center flex items-center justify-center">
                        <SignedIn>
                          {/* <span className="mr-2 mt-2">
                            <OrganizationSwitcher afterSelectOrganizationUrl="/" />
                          </span> */}
                          <UserButton afterSignOutUrl="/sign-in" />
                        </SignedIn>
                        <SignedOut>
                          {/* Signed out users get sign in button */}
                          <SignInButton />
                        </SignedOut>
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userId ? (
                        <Menu.Item></Menu.Item>
                      ) : (
                        <Menu.Item></Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {userId ? (
                navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-slate-50 border-slate-500 text-slate-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                      'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))
              ) : (
                <div></div>
              )}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              {userId ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full text-white text-center flex items-center justify-center">
                        <SignedIn>
                          {/* <span className="mr-2 mt-2">
                            <OrganizationSwitcher />
                          </span> */}
                          <UserButton afterSignOutUrl="/sign-in" />
                        </SignedIn>
                        <SignedOut>
                          {/* Signed out users get sign in button */}
                          <SignInButton />
                        </SignedOut>
                      </div>
                    </div>
                    <div className="ml-3"></div>
                  </div>
                  <div className="mt-3 space-y-1"></div>
                </>
              ) : (
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => signIn('github')}
                    className="flex w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    <SignInButton />
                  </button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DarkVeil from "@/components/DarkVeil";
import { MessageCircle, Shield, Zap, Eye, Users, Lock } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 bg-black h-150 flex items-center">
        {/* DarkVeil as an overlay on the black background */}
        <div className="absolute inset-0">
          <DarkVeil />
        </div>

        {/* Content container is now 'relative' to ensure it stacks on top of the background */}
        <div className="relative container mx-auto px-4 mt-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-sans">
              Send Anonymous Messages
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed font-sans">
              Share your thoughts, confessions, or feedback completely
              anonymously. Connect with others while keeping your identity a
              mystery.
            </p>
            <div className="flex flex-col sm:flex-row gap-10 justify-center mb-12">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-white text-black rounded-4xl cursor-pointer hover:bg-gray-100"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 border-1 bg-transparent border-gray-500 text-gray-400 rounded-4xl cursor-pointer"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Why Choose Mystery Messages?
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Experience the freedom of anonymous communication with complete
              privacy and security at its core.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center bg-zinc-900 border-gray-800 text-white">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">100% Anonymous</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-gray-400 max-w-3xl mx-auto">
                  Your identity remains completely hidden. No registration
                  required, no tracking, just pure anonymity.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center bg-zinc-900 border-gray-800 text-white">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Instant Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-gray-400 max-w-3xl mx-auto">
                  Messages are delivered instantly. Share your thoughts without
                  delay or hesitation.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center bg-zinc-900 border-gray-800 text-white">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-gray-400 max-w-3xl mx-auto">
                  Advanced encryption ensures your messages are safe and
                  private. No data is stored or shared.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              How It Works?
            </h2>
            <p className="text-xl text-gray-400">
              Sending anonymous messages has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Sign Up</h3>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Create your account and get your unique profile link to receive
                anonymous messages
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Share Your Profile Link
              </h3>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Share your unique link with friends, followers, or anyone you
                want to hear from
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Accept Anonymous Messages
              </h3>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Receive honest feedback, confessions, and messages from people
                anonymously
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 ">
            Ready to Start Sending?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust us with their anonymous messages.
            Start your mystery conversation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-100 cursor-pointer rounded-4xl"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Mystery Messages. Send anonymous
            messages with complete privacy.
          </p>
        </div>
      </footer>
    </div>
  );
}

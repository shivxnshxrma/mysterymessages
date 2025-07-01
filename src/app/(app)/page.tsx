import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageCircle,
  Shield,
  Zap,
  Eye,
  Users,
  Lock,
  Link,
} from "lucide-react";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Send Anonymous Messages
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Share your thoughts, confessions, or feedback completely
              anonymously. Connect with others while keeping your identity a
              mystery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 border-2 hover:bg-gray-50"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-50"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Mystery Messages?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the freedom of anonymous communication with complete
              privacy and security.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">100% Anonymous</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Your identity remains completely hidden. No registration
                  required, no tracking, just pure anonymity.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Instant Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Messages are delivered instantly. Share your thoughts without
                  delay or hesitation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Advanced encryption ensures your messages are safe and
                  private. No data is stored or shared.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Sending anonymous messages has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">
                Create your account and get your unique profile link to receive
                anonymous messages
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Share Your Profile Link
              </h3>
              <p className="text-gray-600">
                Share your unique link with friends, followers, or anyone you
                want to hear from
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Accept Anonymous Messages
              </h3>
              <p className="text-gray-600">
                Receive honest feedback, confessions, and messages from people
                anonymously
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
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
                className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-gray-100"
              >
                <Users className="mr-2 h-5 w-5" />
                Get Started Now
              </Button>
            </Link>
            {/* <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-white text-purple-600 hover:bg-white/10"
            >
              Learn More
            </Button> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Mystery Messages. Send anonymous messages with complete
            privacy.
          </p>
        </div>
      </footer>
    </div>
  );
}

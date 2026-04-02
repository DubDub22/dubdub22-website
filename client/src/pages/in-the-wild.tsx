import React from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube } from "lucide-react";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const socialPlaceholders = [
  {
    platform: "instagram",
    Icon: Instagram,
    handle: "@dubdub22",
    comingSoon: true,
  },
  {
    platform: "facebook",
    Icon: Facebook,
    handle: "DubDub22",
    comingSoon: true,
  },
  {
    platform: "youtube",
    Icon: Youtube,
    handle: "DubDub22",
    comingSoon: true,
  },
];

export default function InTheWildPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Check Us Out in the Wild!
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real shooters, real setups. Tag your photos with{" "}
              <strong className="text-primary">#dubdub22</strong> to be featured here.
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {socialPlaceholders.map(({ platform, Icon, handle, comingSoon }) => (
              <Card key={platform} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className={`h-2 ${platform === "instagram" ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600" : platform === "facebook" ? "bg-blue-600" : "bg-red-600"}`} />
                  <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${platform === "instagram" ? "bg-gradient-to-br from-yellow-100 to-pink-100" : "bg-muted"}`}>
                      <Icon className={`w-7 h-7 ${platform === "instagram" ? "text-pink-500" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="font-display font-bold text-lg capitalize">{platform}</p>
                      <p className="text-sm text-muted-foreground">{handle}</p>
                    </div>
                    {comingSoon && (
                      <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        Coming Soon
                      </span>
                    )}
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer border-border hover:border-primary hover:text-primary"
                      disabled
                    >
                      Follow Us
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* #dubdub22 Gallery Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <Card className="border-dashed border-2 border-border">
              <CardContent className="py-16 px-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Instagram className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  #dubdub22 Gallery
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Once our social accounts are set up, your tagged posts will appear here in a live scrolling gallery.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    onClick={() => window.open("https://instagram.com", "_blank")}
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Follow on Instagram
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-6">
                  Want to be featured? Post a photo with <strong>#dubdub22</strong> on Instagram or Facebook!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

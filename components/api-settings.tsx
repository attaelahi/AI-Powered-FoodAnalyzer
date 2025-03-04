"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function ApiSettings() {
  const [fatSecretClientId, setFatSecretClientId] = useState("")
  const [fatSecretClientSecret, setFatSecretClientSecret] = useState("")
  const [openAiApiKey, setOpenAiApiKey] = useState("")
  const { toast } = useToast()

  const handleSaveFatSecret = () => {
    // In a real app, you would save these to a database or localStorage
    // For this demo, we'll just show a toast
    if (!fatSecretClientId || !fatSecretClientSecret) {
      toast({
        title: "Missing information",
        description: "Please provide both Client ID and Client Secret",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "FatSecret API settings saved",
      description: "Your FatSecret API credentials have been updated",
    })
  }

  const handleSaveOpenAI = () => {
    if (!openAiApiKey) {
      toast({
        title: "Missing information",
        description: "Please provide your OpenAI API key",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "OpenAI API settings saved",
      description: "Your OpenAI API key has been updated",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>Configure your own API keys for enhanced functionality and control</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fatsecret">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fatsecret">FatSecret API</TabsTrigger>
            <TabsTrigger value="openai">OpenAI API</TabsTrigger>
          </TabsList>
          <TabsContent value="fatsecret" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="fatsecret-client-id">Client ID</Label>
              <Input
                id="fatsecret-client-id"
                placeholder="Enter your FatSecret Client ID"
                value={fatSecretClientId}
                onChange={(e) => setFatSecretClientId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatsecret-client-secret">Client Secret</Label>
              <Input
                id="fatsecret-client-secret"
                type="password"
                placeholder="Enter your FatSecret Client Secret"
                value={fatSecretClientSecret}
                onChange={(e) => setFatSecretClientSecret(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>You can obtain FatSecret API credentials by:</p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>
                  Creating an account at{" "}
                  <a
                    href="https://platform.fatsecret.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    FatSecret Platform
                  </a>
                </li>
                <li>Registering a new application</li>
                <li>Copying the Client ID and Client Secret</li>
              </ol>
            </div>
          </TabsContent>
          <TabsContent value="openai" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="openai-api-key">API Key</Label>
              <Input
                id="openai-api-key"
                type="password"
                placeholder="Enter your OpenAI API key"
                value={openAiApiKey}
                onChange={(e) => setOpenAiApiKey(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>You can obtain an OpenAI API key by:</p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>
                  Creating an account at{" "}
                  <a
                    href="https://platform.openai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    OpenAI Platform
                  </a>
                </li>
                <li>Navigating to the API keys section</li>
                <li>Creating a new secret key</li>
              </ol>
              <p className="mt-2">
                Using your own OpenAI API key allows for higher rate limits and more control over the model used for
                food recognition.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Tabs defaultValue="fatsecret" className="w-full">
          <TabsContent value="fatsecret" className="mt-0">
            <Button onClick={handleSaveFatSecret}>Save FatSecret Settings</Button>
          </TabsContent>
          <TabsContent value="openai" className="mt-0">
            <Button onClick={handleSaveOpenAI}>Save OpenAI Settings</Button>
          </TabsContent>
        </Tabs>
      </CardFooter>
    </Card>
  )
}


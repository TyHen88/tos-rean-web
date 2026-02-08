import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Code, Link as LinkIcon, ExternalLink } from "lucide-react"

export default function ResourcesPage() {
    const resources = [
        {
            id: "1",
            title: "React Cheatsheet",
            description: "A comprehensive guide to React hooks and common patterns.",
            type: "pdf",
            size: "2.4 MB",
            icon: FileText
        },
        {
            id: "2",
            title: "Next.js Starter Template",
            description: "Production-ready template with Tailwind CSS and TypeScript.",
            type: "code",
            size: "Zip",
            icon: Code
        },
        {
            id: "3",
            title: "UI Design Principles",
            description: "Best practices for creating accessible and beautiful interfaces.",
            type: "link",
            url: "https://example.com/design",
            icon: ExternalLink
        },
        {
            id: "4",
            title: "Interview Questions",
            description: "Top 50 frontend interview questions and answers.",
            type: "pdf",
            size: "1.8 MB",
            icon: FileText
        }
    ]

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Learning Resources</h1>
                <p className="text-muted-foreground">Supplementary materials to boost your skills</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <Card key={resource.id}>
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <resource.icon className="w-6 h-6 text-primary" />
                            </div>
                            {resource.type !== 'link' && <span className="text-xs text-muted-foreground font-mono">{resource.type.toUpperCase()}</span>}
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-lg mb-2">{resource.title}</CardTitle>
                            <CardDescription className="mb-4">{resource.description}</CardDescription>
                            <Button variant="outline" className="w-full gap-2">
                                {resource.type === 'link' ? (
                                    <>Visit Resource <ExternalLink className="w-4 h-4" /></>
                                ) : (
                                    <>Download <Download className="w-4 h-4" /></>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

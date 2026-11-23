
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Authenticator } from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import './App.css'

const client = generateClient<Schema>()

function App() {
  const [ingredients, setIngredients] = useState('')
  const [recipe, setRecipe] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerateRecipe() {
    if (!ingredients.trim()) {
      setError('Please enter at least one ingredient.')
      return
    }

    setLoading(true)
    setError('')
    setRecipe('')

    try {
      const { data, errors } = await client.queries.generateRecipe({
        ingredients: ingredients.trim(),
      })

      if (errors?.length) {
        throw new Error(errors.map((e) => e.message).join(', '))
      }

      setRecipe(data ?? 'No recipe was returned.')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate recipe.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main className="recipe-app">
          <header className="recipe-header">
            <div>
              <h1>AI Recipe Generator</h1>
              <p>Powered by Amazon Bedrock and Claude</p>
            </div>
            <button type="button" onClick={signOut}>
              Sign Out
            </button>
          </header>

          <section className="recipe-card">
            <p><strong>Student:</strong> Mohib Sahi</p>
            <p><strong>Signed in:</strong> {user?.signInDetails?.loginId ?? 
'Authenticated user'}</p>

            <h2>What's in your kitchen?</h2>
            <p>Enter your ingredients and let AI create a recipe.</p>

            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Example: chicken, rice, tomatoes, onions"
              rows={4}
            />

            <button
              type="button"
              onClick={handleGenerateRecipe}
              disabled={loading}
            >
              {loading ? 'Generating Recipe...' : 'Generate Recipe'}
            </button>

            {error && <p role="alert" className="recipe-error">{error}</p>}

            {recipe && (
              <section className="recipe-result">
                <h2>Your AI-Generated Recipe</h2>
                <div className="recipe-text">
  <ReactMarkdown>{recipe}</ReactMarkdown>
</div>
              </section>
            )}
          </section>
        </main>
      )}
    </Authenticator>
  )
}

export default App


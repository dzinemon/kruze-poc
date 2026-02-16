# Ports                           
```bash  
  lsof -i :3000                                                                 
                                                                                
  # Kill it
  kill $(lsof -ti :3000) 
                  
  # Force kill if needed
  kill -9 $(lsof -ti :3000)

  Replace 3000 with whatever port you need (3333, 4321, etc.).

  To kill multiple ports at once:

  kill $(lsof -ti :3000,:3333,:4321)
```


## Option 1 — Run all concurrently (stays in one terminal)
`pnpm dev:studio & pnpm dev:next & pnpm dev:astro &`
                                                                                
## Option 2 — With output suppressed to background
```bash
pnpm dev:studio > /dev/null 2>&1 &                                            
pnpm dev:next > /dev/null 2>&1 &
pnpm dev:astro > /dev/null 2>&1 &
```

## Option 3 — Turbo (if configured)

Your turbo.json likely supports running all dev tasks at once:
`pnpm dev`

This runs all dev scripts in parallel with interleaved output.

To stop them all later:
`kill $(lsof -ti :3000,:3333,:4321)`

Option 3 is the cleanest since you're already using Turborepo.
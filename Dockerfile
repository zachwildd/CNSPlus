# ---- build ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs
WORKDIR /src
COPY . .
# npm's optionalDependencies have a long-standing cross-platform bug: when
# package-lock.json was generated on a different OS/arch than the install
# target (likely here — local dev is macOS arm64, Fly builds linux/amd64),
# the platform-correct @tailwindcss/oxide-* binary gets silently skipped,
# leaving Tailwind unable to scan razor files and producing CSS without any
# utility classes. Removing the lockfile forces fresh resolution for the
# builder's actual platform; pre-populating node_modules also makes the
# MSBuild BuildTailwind target skip its own install.
RUN cd tailwind \
    && rm -f package-lock.json \
    && CI=1 npm install --include=optional
RUN dotnet restore src/CNSPlus.Web/CNSPlus.Web.csproj
RUN dotnet publish src/CNSPlus.Web/CNSPlus.Web.csproj \
    -c Release -o /app /p:UseAppHost=false

# ---- runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app ./
# Phase 3: ship /content with the image so the PhysicalFileProvider can serve it
COPY --from=build /src/content /content
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
EXPOSE 8080
ENTRYPOINT ["dotnet", "CNSPlus.Web.dll"]
